
const currentTicketLbl = document.querySelector('#lbl-new-ticket');
const createTicketBtn = document.querySelector('button');

getLastTicket = async ()=> {

    try{
        const response = await fetch('api/ticket/last');
        const data = await response.json();
        currentTicketLbl.innerHTML=data;
    }catch(error){
        console.log(error);
    }

}

getLastTicket();

createTicket = async () =>{
    try{
        const response = await fetch('api/ticket',{
            method:'POST'
        });
        const data = await response.json();
        currentTicketLbl.innerHTML=data.number;

    }catch(error){
        console.log(error);
    }
}

createTicketBtn.addEventListener('click', createTicket);