
const renderTickets = (tickets=[]) =>{

    for(let i = 0; i< tickets.length; i++){
        if(i >= 4) break;
        const ticket = tickets[i]

        if(!ticket) continue;

        const ticketLbl = document.querySelector(`#lbl-ticket-0${i+1}`);
        const deskLbl = document.querySelector(`#lbl-desk-0${i+1}`);

        ticketLbl.innerHTML = `Ticket ${ticket.number}`;
        deskLbl.innerHTML = ticket.handleAtDesk;

    }
}


const loadCurrentTickets = async ()=>{
    const tickets = await fetch('api/ticket/working-on').then(r => r.json());
    
    renderTickets(tickets)

}


connectToWebSockets = ()=> {

    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = (event) => {

        const {type , payload} = JSON.parse(event.data);
        if(type !== 'on-working-changed') return;
        renderTickets(payload)
    };

    socket.onclose = (event) => {
        console.log('Connection closed');
        setTimeout(() => {
            console.log('retrying to connect');
            connectToWebSockets();
        }, 1500);

    };

    socket.onopen = (event) => {
        console.log('Connected');
    };

}

connectToWebSockets();
loadCurrentTickets();