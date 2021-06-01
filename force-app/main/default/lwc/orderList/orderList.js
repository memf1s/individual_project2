import { LightningElement, wire, track } from 'lwc';
import Id from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';
import { subscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import PRODUCT_ADDED_MESSAGE from '@salesforce/messageChannel/ProductAdded__c';
import createOrder from '@salesforce/apex/OrderController.createOrder';

function calculateOrderSummary(orderItems) {
    const summary = orderItems.reduce(
        (acc, orderItem) => {
            const quantity = orderItem.Quantity;
            const price = orderItem.Price;
            acc.quantity += quantity;
            acc.price += price * quantity;
            return acc;
        },
        { quantity: 0, price: 0 }
    );
    return summary;
}

export default class OrderList extends LightningElement {
    userId = Id;
    isGuestUser = isGuest;
    @track
    _orderItems = [];
    get orderItems() {
        return this._orderItems;
    }
    set orderItems(value) {
        this._orderItems = value;
    }

    orderPrice = 0;
    orderQuantity = 0;
    error;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.productAddedSubscription = subscribe(
            this.messageContext,
            PRODUCT_ADDED_MESSAGE,
            (message) => this.handleOrderItemAdded(message)
        );
    }

    handleLoginClick() {
        window.open('/login');
    }

    handleOrderItemAdded(message) {
        let index = this.orderItems.findIndex(x => x.Id === message.productItem.Id);
        if(index >= 0) {
            this.orderItems[index].Quantity = +this.orderItems[index].Quantity + +message.quantity;
            if(this.orderItems[index].Quantity > this.orderItems[index].QuantityInStock) {
                this.orderItems[index].Quantity = this.orderItems[index].QuantityInStock;
            }
        } else {
            let orderItem = {...message.productItem};
            orderItem.Quantity = +orderItem.Quantity + +message.quantity;
            this.orderItems = [...this.orderItems, orderItem];
        }
        const summary = calculateOrderSummary(this.orderItems);
        this.orderQuantity = summary.quantity;
        this.orderPrice = summary.price;
    }

    handleSubmitOrder() {
        createOrder( { orderItems : this.orderItems } )
            .then((result) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Your Order ID is ' + result.Id
                    })
                );
                this.myArray = [{}];
            })
            .catch((e) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating order',
                        message: reduceErrors(e).join(', '),
                        variant: 'error'
                    })
                );
            });
        this.orderItems = [];
    }

    handleOrderItemChange(event) {
        let index = this.orderItems.findIndex(x => x.Id === event.detail.id);
        if(index >= 0) {
            this.orderItems[index].Quantity = event.detail.quantity;
            if(this.orderItems[index].Quantity > this.orderItems[index].QuantityInStock) {
                this.orderItems[index].Quantity = this.orderItems[index].QuantityInStock;
            }
        }
    }

    handleOrderItemDelete(event) {
        const orderItem = event.currentTarget.dataset.order-item;
        let index = orderItems.indexOf(orderItem);
        if (index > -1) {
            orderItems.splice(index, 1);
        }
        this.setOrderItems(orderItems);
    }

    handleClearOrder() {
        this.orderItems = [];
    }
}
