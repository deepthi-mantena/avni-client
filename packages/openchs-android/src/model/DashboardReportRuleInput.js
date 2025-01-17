// These classes are created to document the contract with the rules. Objects has been used in place of arrays to allow for flexibility in contract in the future.

export class DashboardReportFilterRuleInput {
    type;
    dataType;
    subjectType;
    groupSubjectTypeFilter;
    observationBasedFilter;
    filterValue;
}

class DashboardReportRuleInput {
    filterValues;

    constructor(filterValues) {
        this.filterValues = filterValues;
    }
}

export default DashboardReportRuleInput;
