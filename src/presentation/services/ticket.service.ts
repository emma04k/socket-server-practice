import { UuidAdapater } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";
import { WssService } from "./wss.service";


export class TicketService {

    private readonly wssService = WssService;

    public readonly tickets:Ticket[] = [
        {id:UuidAdapater.V4(),number:1,createdAt:new Date(),done:false},
        {id:UuidAdapater.V4(),number:2,createdAt:new Date(),done:false},
        {id:UuidAdapater.V4(),number:3,createdAt:new Date(),done:false},
        {id:UuidAdapater.V4(),number:4,createdAt:new Date(),done:false},
        {id:UuidAdapater.V4(),number:5,createdAt:new Date(),done:false},
        {id:UuidAdapater.V4(),number:6,createdAt:new Date(),done:false}
    ];

    private readonly workingOnTickets: Ticket[] = [];

    public get lastWorkingOnTickets():Ticket[]{
        return this.workingOnTickets.slice(0,4);
    }

    public get pendingTickets():Ticket[]{
        return this.tickets.filter(ticket => !ticket.handleAtDesk);
    }

    public get lastTicketNumber():number{
        return this.tickets.length > 0 ? this.tickets.at(-1)!.number: 0;
    }; 

    public createTicket():Ticket{
        
        const ticket: Ticket = {
            id:UuidAdapater.V4(),
            number: this.lastTicketNumber + 1,
            createdAt: new Date(),
            done: false,
        }

        this.tickets.push(ticket);
        this.onTicketNumberChanged()

        return ticket
    }

    public drawTicket(desk:string){
        const ticket = this.tickets.find(t => !t.handleAtDesk);
        if(!ticket) return { status: 'error', message:'No hay tickets pendientes' }

        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();

        this.workingOnTickets.unshift({...ticket}); 

        this.onTicketNumberChanged();
        this.onWorkinOnChanged();

        return {status: 'ok', ticket}
    }

    public onDoneTicket(id:string){
        
        const ticket = this.tickets.find(t => t.id === id);
        if(!ticket) return { status: 'error', message:'Ticket no encontrado' }

        ticket.done = true;
        ticket.doneAt = new Date();

        const index = this.workingOnTickets.findIndex(t => t.id === id)
        if(index !== -1){this.workingOnTickets.splice(index,1);}

        return { status: 'ok', ticket}
    
    }

    private onTicketNumberChanged(){
        this.wssService.instance.sendMessage('on-ticket-count-changed', this.pendingTickets.length);
    }

    private onWorkinOnChanged(){
        this.wssService.instance.sendMessage('on-working-changed', this.lastWorkingOnTickets);
    }
}