import { LightningElement, wire, api, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCT_ADDED_MESSAGE from '@salesforce/messageChannel/ProductAdded__c';
import PRODUCT_IMAGES from '@salesforce/resourceUrl/productImages';

export default class ProductDetail extends LightningElement {
    pictureUrl;
    @track
    quantity = 1;
    overflowMessage;

    @wire(MessageContext)
    messageContext;

    _product;
    @api
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.overflowMessage = 'Maximum value is ' + this.product.QuantityInStock;
        this.pictureUrl = PRODUCT_IMAGES + '/' + value.Name.split(' ').join('_') + '.jpg';
    }

    register() {
        var inputCmp = this.template.querySelector(".inputCmp");
        inputCmp.setAttribute('message-when-range-overflow','Maximum value is ' + this.product.QuantityInStock);
    }

    handleToCartClick() {
        publish(this.messageContext, PRODUCT_ADDED_MESSAGE, {
            productItem: this.product,
            quantity: this.quantity
        });
    }

    handleQuantityChange(event) {
        this.quantity = event.detail.value > this.product.QuantityInStock ?
                        this.product.QuantityInStock : event.detail.value;
    }
}