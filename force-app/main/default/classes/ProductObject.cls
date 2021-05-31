public with sharing class ProductObject {
    @AuraEnabled
    public Id Id { get; set; }
    @AuraEnabled
    public String Name { get; set; }
    @AuraEnabled
    public String Family { get; set; }
    @AuraEnabled
    public String Description { get; set; }
    @AuraEnabled
    public Decimal Price { get; set; }
    @AuraEnabled
    public Boolean isActive { get; set; }
    @AuraEnabled
    public Decimal QuantityInStock { get; set; }

    public ProductObject(PricebookEntry pbEntry) {
        Id = pbEntry.Product2.Id;
        Name = pbEntry.Product2.Name;
        Family = pbEntry.Product2.Family;
        Description = pbEntry.Product2.Description;
        Price = pbEntry.UnitPrice;
        isActive = pbEntry.IsActive;
        QuantityInStock = pbEntry.Product2.Quantity__c;
    }
}