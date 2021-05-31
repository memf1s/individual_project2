import { LightningElement,wire } from 'lwc';
import getCategoriesWithTotals from '@salesforce/apex/CategoryManager.getCategoriesWithTotals';
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';

export default class CategoryMenu extends LightningElement {
    searchKey = '';
    filters = {
        searchKey: ''
    };

    @wire(MessageContext)
    messageContext;

    @wire(getCategoriesWithTotals)
    categories;
    handleCatalogClick(e) {
        let selectedCategoryName = e.currentTarget.dataset.id;
        this.filters = {};
        publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
            filters: this.filters
        });
    }
    handleCategoryClick(e) {
        let selectedCategoryName = e.currentTarget.dataset.id;
        this.filters.category = selectedCategoryName;
        publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
            filters: this.filters
        });
    }
}