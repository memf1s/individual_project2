public with sharing class ProductController {
    static Integer PAGE_SIZE = 8;
    // TODO: find a way to retieve the pricebook assigned to the store
    static Id PETSTORE_PRICEBOOK = '01s0900000DJ9pzAAD';

    public class Filters {
        @AuraEnabled
        public String searchKey { get; set; }
        @AuraEnabled
        public String category { get; set; }
    }

    @AuraEnabled(Cacheable=true)
    public static PagedResult getProducts(Filters filters, Integer pageNumber) {
        PagedResult result = new PagedResult();
        result.pageSize = PAGE_SIZE;
        result.pageNumber = pageNumber;
        String whereClause = BuildWhereClauseFromFilters(filters);

        String countQuery = 'SELECT count() FROM PricebookEntry ' +
            'WHERE Pricebook2Id = :PETSTORE_PRICEBOOK' + whereClause;
        result.totalItemCount = Database.countQuery(countQuery);

        Integer offset = (pageNumber - 1) * PAGE_SIZE;
        String resultQuery = 'SELECT IsActive, UnitPrice, Product2.Id, ' +
            'Product2.Name, Product2.Family, Product2.Description, Product2.Quantity__c ' + 
            'FROM PricebookEntry WHERE Pricebook2Id = :PETSTORE_PRICEBOOK ' +
            whereClause +
            'ORDER BY Name LIMIT :PAGE_SIZE OFFSET :offset';
        List<PricebookEntry> pbEntries = Database.query(resultQuery);
           
        result.records = new List<ProductObject>();
        for(PricebookEntry pbEntry : pbEntries) {
            if(pbEntry.IsActive == true) {
                ProductObject record = new ProductObject(pbEntry);
                result.records.add(record);
            }
        }
        return result;
    }

    private static String BuildWhereClauseFromFilters(Filters filters) {
        String key, whereClause = '';
        String[] criteria = new List<String>{};
        if (filters != null) {
            if (!String.isEmpty(filters.searchKey)) {
                key = '\'%' + filters.searchKey + '%\'';
                criteria.add('Product2.Name LIKE ' + key);
            }
            if (!String.isEmpty(filters.category)) {
                key = '\'%' + filters.category + '%\'';
                criteria.add('Product2.Family LIKE ' + key);
            }
            if (criteria.size() > 0) {
                whereClause = ' AND ' + String.join(criteria, ' AND ');
            }
        }
        return whereClause;
    }
}