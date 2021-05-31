import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductTileList extends LightningElement {
    pageNumber = 1;
    pageSize;
    totalItemCount = 0;
    filters = {};

    @wire(MessageContext) messageContext;
    productFilterSubscription;

    @wire(getProducts, { filters: '$filters', pageNumber: '$pageNumber' })
    products;

    connectedCallback() {
        this.productFilterSubscription = subscribe(
            this.messageContext,
            PRODUCTS_FILTERED_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }
    
    handleFilterChange(message) {
        this.filters = { ...message.filters };
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber -= 1;
    }

    handleNextPage() {
        this.pageNumber += 1;
    }
}