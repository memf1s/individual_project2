public with sharing class CategoryManager {
    public CategoryManager() {}

    public with sharing class CategoryWithTotal {
        @AuraEnabled
        public String name {get;private set;}
        @AuraEnabled
        public Integer count {get;private set;}
        public CategoryWithTotal(String name, Integer count) {
            this.name = name;
            this.count = count;
        }
    }

    @AuraEnabled(Cacheable=true)
    public static List<Object> getCategoriesWithTotals() {
        List<Object> categoriesWithTotals = new List<Object> ();
        for (AggregateResult ar : [select Family, count(Id) c from Product2 where Family != null group by Family]) {
            categoriesWithTotals.add( new CategoryWithTotal(
                String.valueOf(ar.get('Family')),
                Integer.valueOf(ar.get('c'))
            ));
        }
        return categoriesWithTotals;
    }
}