import { LightningElement, api, track } from 'lwc';
import PRODUCT_IMAGES from '@salesforce/resourceUrl/productImages';

export default class OrderItem extends LightningElement {
    pictureUrl;
    @track
    quantity;

    _orderItem;
    @api
    get orderItem() {
        return this._orderItem;
    }
    set orderItem(value) {
        this._orderItem = value;
        this.quantity = value.Quantity;
        this.pictureUrl = PRODUCT_IMAGES + '/' + value.Name.split(' ').join('_') + '.jpg';
    }

    register() {
        var inputCmp = this.template.querySelector(".inputCmp");
        inputCmp.setAttribute('message-when-range-overflow','Maximum value is ' + this.orderItem.QuantityInStock);
    }

    handleQuantityChange() {
        const event = new CustomEvent('orderitemchange', {
            detail: { id: this.orderItem.Id, quantity : this.quantity }
        });
        this.dispatchEvent(event);
        this.quantity.orderItem.Quantity;
    }

    deleteOrderItem() {
        const event = new CustomEvent('orderitemdelete', {
            detail: { id: this.orderItem.Id }
        });
        this.dispatchEvent(event);
    }
}
