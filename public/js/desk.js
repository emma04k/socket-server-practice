const pendingLbl = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const noMoreAlert =document.querySelector('.alert');
const currentTicketLbl = document.querySelector('small');
const drawBtn = document.querySelector('#btn-draw');
const doneBtn = document.querySelector('#btn-done');

const searchParams = new URLSearchParams(window.location.search);
let workingTicket = null;

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('Escritorio es requerido')
}

const deskNumber = searchParams.get('escritorio'); 
deskHeader.innerText = deskNumber

const checkTicketCount = (currentCount = 0)=>{

    if(currentCount === 0){
        noMoreAlert.classList.remove('d-none');
    }else{
        noMoreAlert.classList.add('d-none');
    }

    pendingLbl.innerHTML=currentCount;
}

const loadInitialCount = async() =>{
    try{

        const pendingList = await fetch('api/ticket/pending').then(r => r.json());
        const pendingCount = pendingList.length || 0
        checkTicketCount(pendingCount)
    }catch(error){
        console.log(error)
    }
}



const getTicket = async () =>{

    doneTicket();

    const {status,ticket,message} = await fetch(`api/ticket/draw/${deskNumber}`).then(resp => resp.json());

    if(status === 'error'){
        currentTicketLbl.innerHTML =message;
        return
    }

    workingTicket = ticket;
    currentTicketLbl.innerHTML = ticket.number;
}

const doneTicket = async()=>{
    if(!workingTicket) return;
    const {status,message} = await fetch(`api/ticket/done/${workingTicket.id}`,{method:'PUT'})
        .then(r => r.json());

    if(status === 'ok'){
        workingTicket = null;
        currentTicketLbl.innerHTML = 'Nadie'
    }
    
}


connectToWebSockets = ()=> {

    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = (event) => {

        const {type , payload} = JSON.parse(event.data);
        if(type !== 'on-ticket-count-changed') return;
        checkTicketCount(payload)
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

drawBtn.addEventListener('click',getTicket);
doneBtn.addEventListener('click',doneTicket);


loadInitialCount();
connectToWebSockets();