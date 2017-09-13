import FormElementGroup from "../src/application/FormElementGroup";
import Form from "../src/application/Form";
import FormElement from "../src/application/FormElement";
import _ from 'lodash';
import Concept from "../src/Concept";
import Program from "../src/Program";
import General from '../src/utility/General';
import ChecklistItem from "../src/ChecklistItem";
import Observation from "../src/Observation";
import PrimitiveValue from "../src/observation/PrimitiveValue";
import ProgramEncounter from "../src/ProgramEncounter";
import ObservationRule from "../src/observation/ObservationRule";
import ProgramEnrolment from "../src/ProgramEnrolment";

class EntityFactory {
    static createSafeProgram(name) {
        const program = new Program();
        program.uuid = General.randomUUID();
        program.name = name;
        return program;
    }

    static createSafeFormElementGroup(form) {
        const formElementGroup = new FormElementGroup();
        formElementGroup.formElements = [];
        formElementGroup.form = form;
        form.addFormElementGroup(formElementGroup);
        return formElementGroup;
    }

    static createFormElementGroup(name, displayOrder, form) {
        const formElementGroup = EntityFactory.createSafeFormElementGroup(form);
        formElementGroup.name = name;
        formElementGroup.displayOrder = displayOrder;
        return formElementGroup;
    }

    static createForm(name) {
        const form = new Form();
        form.name = name;
        form.formElementGroups = [];
        return form;
    }

    static createFormElement(name, mandatory, concept, displayOrder) {
        const formElement = new FormElement();
        formElement.uuid = General.randomUUID();
        formElement.name = name;
        formElement.mandatory = mandatory;
        formElement.concept = concept;
        formElement.displayOrder = displayOrder;
        return formElement;
    }

    static addCodedAnswers(concept, answers) {
        _.forEach(answers, (answer) => concept.addAnswer(EntityFactory.createConcept(answer, Concept.dataType.NA)));
    }

    static createConcept(name, dataType, uuid) {
        const concept = Concept.create(name, dataType);
        concept.uuid = uuid || General.randomUUID();
        if (dataType === Concept.dataType.Coded)
            concept.answers = [];
        return concept;
    }

    static addChecklistItem(checklist, name, dueDate) {
        const item = ChecklistItem.create();
        item.concept = Concept.create(name, Concept.dataType.NA);
        item.dueDate = dueDate;
        checklist.addItem(item);
        return item;
    }

    static createObservation(concept, primitiveValue) {
        return Observation.create(concept, new PrimitiveValue(primitiveValue));
    }

    static createDecision(name, value) {
        const decision = {};
        decision.name = name;
        decision.value = value;
        return decision;
    }

    static createProgramEncounter({programEnrolment, encounterDateTime = new Date(), observations = []}) {
        const programEncounter = ProgramEncounter.createEmptyInstance();
        programEncounter.encounterDateTime = encounterDateTime;
        programEncounter.observations = observations;
        programEncounter.programEnrolment = programEnrolment;
        return programEncounter;
    }

    static createEnrolment({enrolmentDateTime = new Date(), program = null, observations = []}) {
        const programEnrolment = ProgramEnrolment.createEmptyInstance();
        programEnrolment.enrolmentDateTime = enrolmentDateTime;
        programEnrolment.program = program;
        programEnrolment.observations = observations;
        return programEnrolment;
    }

    static createObservationRule() {
        return new ObservationRule();
    }

    static createProgram = function ({uuid = General.randomUUID(), name = null}) {
        const program = new Program();
        program.uuid = uuid;
        program.name = name;
        return program;
    };
}

export default EntityFactory;