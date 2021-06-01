public with sharing class OrderController {
    @AuraEnabled
    public static Order__c createOrder(List<Map<String, Object>> orderItems) {
        Id contactId = [Select contactid from User where id =: Userinfo.getUserid()].ContactId;
        Id accountId  = [Select AccountID from Contact where id =: contactId].AccountId;
        Order__c newOrder = new Order__c(Account__c = accountId, Contact__c = ContactId);
        insert newOrder;
        List<Order_Item__c> newOrderItems = new List<Order_Item__c>();

        for (Map<String, Object> item : orderItems) {
            Order_Item__c newItem = new Order_Item__c();
            newItem.Product__c = (Id) item.get('Id');
            newItem.Price__c = Double.valueOf(item.get('Price'));
            newItem.Quantity__c = Double.valueOf(item.get('Quantity'));
            newItem.Order__c = newOrder.Id;
            newOrderItems.add(newItem);
        }
        insert newOrderItems;

        return newOrder;
    }

}