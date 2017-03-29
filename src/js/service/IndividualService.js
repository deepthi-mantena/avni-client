import BaseService from "./BaseService.js";
import Service from "../framework/bean/Service";
import Individual from "../models/Individual";
import _ from 'lodash';
import General from "../utility/General";
import EntityQueue from "../models/EntityQueue";
import Program from "../models/Program";
import ObservationsHolder from '../models/ObservationsHolder';

@Service("individualService")
class IndividualService extends BaseService {
    constructor(db, context) {
        super(db, context);
    }

    getSchema() {
        return Individual.schema.name;
    }

    search(criteria) {
        return _.isEmpty(criteria.getFilterCriteria()) ? this.db.objects(Individual.schema.name).slice(0, 100) :
            this.db.objects(Individual.schema.name)
            .filtered(criteria.getFilterCriteria(),
                criteria.getMinDateOfBirth(),
                criteria.getMaxDateOfBirth()).slice(0, 100);
    }

    register(individual) {
        const db = this.db;
        ObservationsHolder.convertObsForSave(individual.observations);
        console.log(individual);
        this.db.write(() => {
            db.create(Individual.schema.name, individual, true);
            db.create(EntityQueue.schema.name, EntityQueue.create(individual, Individual.schema.name));
        });
    }

    eligiblePrograms(individualUUID) {
        const programs = this.getAll(Program.schema.name);
        const individual = this.findByUUID(individualUUID, Individual.schema.name);
        return individual.eligiblePrograms(programs);
    }
}

export default IndividualService;