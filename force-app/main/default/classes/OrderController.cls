public with sharing class OrderController {
    @AuraEnabled
    public static Id createOrder(List<Map<String, Object>> orderItems) {
        List<Order_Item__c> newOrderItems = new List<Order_Item__c>();

        for (Map<String, Object> item : orderItems) {
            Order_Item__c newItem = new Order_Item__c();
            newItem.Product__c = (Id) item.get('Id');
            newItem.Price__c = Double.valueOf(item.get('Price'));
            newItem.Quantity__c = Double.valueOf(item.get('Quantity'));
            newItem.Order__c = 'a0309000004F05cAAC';
            newOrderItems.add(newItem);
        }
        System.debug(newOrderItems);
        insert newOrderItems;

        return 'a0309000004F05cAAC';
    }

}   