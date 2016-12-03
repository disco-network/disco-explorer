/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

/// <reference path="../core/data.viewmodel.ts" />

module disco.viewmodel {

    export interface DataServices {
        schema: any[];
    }

    export class Metadata {
        public version: string;
        public dataServices: DataServices;
    }

    export class OntologyExplorer extends disco.core.viewmodel.Base {
        public metadata: any;
        public entitySets: any;
        public entityCollection: any;

        private setMetadata: () => void;
        private setEntities: () => void;

        public onMetadataClick: () => void;
        public onShowEntitySetDataClick: (data: EntityData, element: any) => void;
        public onShowDetailedDataClick: ($data: any, $parents: any[]) => void;
        public onShowPropertyDetailsClick: ($data: any, $parents: any[], data: any, event: any) => void;

        public loadEntitySet: (uri: string, data: EntityData, done: (data: any) => void) => void;
        public loadEntity: (uri: string, data: EntityData, done: (entity: Entity) => void) => void;

        constructor() {
            super();

            this.metadata = ko.observable();
            this.entitySets = ko.observableArray();
            this.entityCollection = ko.observableArray();
            this.errorCollection = ko.observableArray();

            this.onShowDetailedDataClick = ($data: any, $parents: any) => {

                var detailsEntityData = $parents[2];

                var entityData: EntityData = disco.core.CollectionQuery.single(this.entityCollection(), (item: EntityData, index: number) => {
                    return item.display() == $data.entitySet;
                });
                if (!disco.core.CollectionQuery.contains(detailsEntityData.details(), (item: any, index: number) => {
                    return (item.entityData.display() == entityData.display()) && (item.data.Id == $data.Id);
                })) {
                    var entitySet: EntitySet = disco.core.CollectionQuery.single(this.entitySets(), (item: EntitySet, index: number) => {
                        return item.name == $data.entitySet;
                    });

                    var entityCollection: EntityData[] = [];
                    for (var i = 0; i < entitySet.type.navigationProperties.length; i++) {
                        var navigationProperty: NavigationProperty = entitySet.type.navigationProperties[i];
                        var navigationEntityData: EntityData = disco.core.CollectionQuery.single(this.entityCollection(), (item: EntityData, index: number) => {
                            return 'Disco.Ontology.' + item.type.name == navigationProperty.to.type;
                        });
                        entityCollection.push(navigationEntityData);
                    }

                    var details = this.createDetail("one", entityCollection, entityData, $data);

                    detailsEntityData.details.push(details);
                }
            }

            this.onShowPropertyDetailsClick = ($data: any, $parents: any[], data: any, event: any) => {

                if (!$data.isNavigation)
                    return;

                var $parent = $parents[0];
                var $grandparent = $parents[1];
                var entity : Entity = $parent.data;

                //Get the object to which to append the details tab
                var detailsEntityData: EntityData = disco.core.CollectionQuery.single(this.entityCollection(), (item: EntityData, index: number) => {
                    return item.display() == $grandparent.type.entitySet;
                });

                //Get the entity set which contains the navigation property
                var entitySet: EntitySet = disco.core.CollectionQuery.single(this.entitySets(), (item: EntitySet, index: number) => {
                    return 'Disco.Ontology.' + item.type.name == $data.type;
                });

                var entityData: EntityData = disco.core.CollectionQuery.single(this.entityCollection(), (item: EntityData, index: number) => {
                    return item.display() == entitySet.type.entitySet;
                });

                var entityCollection: EntityData[] = [];
                for (var i = 0; i < entitySet.type.navigationProperties.length; i++) {
                    var navigationProperty: NavigationProperty = entitySet.type.navigationProperties[i];
                    var navigationEntityData: EntityData = disco.core.CollectionQuery.single(this.entityCollection(), (item: EntityData, index: number) => {
                        return 'Disco.Ontology.' + item.type.name == navigationProperty.to.type;
                    });
                    entityCollection.push(navigationEntityData);
                }

                var uri = entity.uri + '/' + $data.name;

                if ($data.isMany) {
                    if (entity.elements[$data.name]() == undefined) {
                        this.loadEntitySet(uri, entityData, (entitySet: EntityArray) => {
                            //var details = this.createDetail("many", entityCollection, entityData, entitySet);
                            //$parent.detail(entitySet);
                            entity.elements[$data.name](entitySet);
                        });
                    }
                    else
                        jQuery(event.currentTarget).next().slideToggle();
                }
                else {
                    this.loadEntity(uri, entityData, (entity: Entity) => {
                        if (entity != undefined) {
                            if (!disco.core.CollectionQuery.contains(detailsEntityData.details(), (item: any, index: number) => {
                                return (item.entityData.display() == entityData.display()) && (item.data.Id == entity['Id']);
                            })) {
                                var details = this.createDetail("one", entityCollection, entityData, entity);
                                detailsEntityData.details.push(details);
                            }
                        }
                    });
                }
            }

            this.onShowEntitySetDataClick = (data: EntityData, element: any) => {
                if (!data.allLoaded()) {
                    this.requestData({
                        uri: data.uri(),
                        context: { data: data },
                        done: this.onEntityDataLoaded
                    });
                } else {
                    this.onCollapsableHeadlineClick(data, element);
                }
            }

            this.loadEntitySet = (uri: string, data: EntityData, done: (data: any) => void) => {
                var self = this;
                this.requestData({
                    uri: uri,
                    context: { data: data },
                    done: function (data) {
                        self.onEntitySetLoaded.call(this, data, done);
                    }
                });
            }

            this.loadEntity = (uri: string, data: EntityData, done: (entity: Entity) => void) => {
                var self: OntologyExplorer = this;
                this.requestData({
                    uri: uri,
                    context: { data: data },
                    done: function (data) {
                        self.onEntityLoaded.call(this, data, done);
                    }
                });
            };

            this.onMetadataClick = () => {
                this.entityCollection.removeAll();
                this.errorCollection.removeAll();

                this.isBusy(true);
                this.context.getMetadata(
                    this.getServiceUri() + '$metadata',
                    this.metadata,
                    () => {
                        this.setMetadata();
                        this.setEntities();
                        this.isBusy(false);
                    },
                    (error) => {
                        this.onAjaxError(error);
                        this.isBusy(false);
                    });
            }

            this.setMetadata = () => {
                var data = this.metadata();
                disco.core.JsonViewer.createTree(jQuery('#jsonViewer'), data);
            };

            this.setEntities = () => {
                var entityCollection: EntityData[] = [];

                var data = this.metadata();

                var entitySets: EntitySet[] = this.getEntitySets();
                this.entitySets(entitySets);

                for (var i = 0; i < entitySets.length; i++) {
                    var entitySet: EntitySet = entitySets[i];

                    if (entitySet.type.abstract == 'true') { continue; }

                    var entityData: EntityData = new EntityData();
                    entityData.type = entitySet.type;
                    entityData.display(entitySet.name);
                    entityData.properties(this.getProperties(entitySet.type));

                    var uri: string = this.getServiceUri() + entitySet.name;
                    entityData.uri(uri);

                    entityCollection.push(entityData);
                }

                this.entityCollection(entityCollection);

                var json: string = ko.toJSON(entityCollection, null, '   ');
                jQuery('#entities').html(json);

            };
        }

        public createDetail(detailMultiplicity: any, entityCollection: EntityData[], entityData: EntityData, data: any): any {
            return {detailMultiplicity: detailMultiplicity, entityCollection: entityCollection, entityData: entityData, data: data};
        }

        public onNavigationPropertyLoaded(data: any): void {
            var context: disco.core.viewmodel.requestContext = (<any>this).context;
            var value = <KnockoutObservableStatic>context.data;

            context.self.writeNavigationPropertyField(data, value);
        }

        public writeNavigationPropertyField(data: any, propertyField: KnockoutObservableStatic) {
            var value: KnockoutObservableStatic = propertyField;
            if (data == undefined) {
                value('NULL');
            }
            else if (data.Email || data.Name || data.Text || data.Value || data.Description || data.Alias)
                value(data.Email || data.Name || data.Text || data.Value || data.Description || data.Alias);
            else if (data['Description@odata.navigationLinkUrl']) {
                this.context.getData({
                    uri: data['Description@odata.navigationLinkUrl'],
                    context: { data: value, self: this },
                    done: this.onNavigationPropertyLoaded
                });
            }
            else if (data.value) {
                if (data.value.length == 0)
                    value("(none)");
                else if (data.value.length == 1)
                    this.writeNavigationPropertyField(data.value[0], propertyField);
                else
                    value('(list)');
            }
            else
                value('(1 element)');
        }

        public onEntityDataLoaded(data: any): void {
            var context: disco.core.viewmodel.requestContext = (<any>this).context;
            var entityData = <EntityData>context.data;

            for (var j = 0; j < data.value.length; j++) {

                var entity: Entity = new Entity(entityData.display());

                var rowData: any = data.value[j];
                entity.uri = rowData['odata.id'];

                if (disco.core.CollectionQuery.contains(entityData.rows(), (item: any, index: any) => {
                    return item.Id == rowData.Id;
                }))
                    continue;

                for (var k = 0; k < entityData.properties().length; k++) {
                    var property: EntityProperty = entityData.properties()[k];
                    var propertyName = property.name;
                    var value: any;
                    if (property.isNavigation) {
                        propertyName = propertyName + '@odata.navigationLinkUrl';
                        value = ko.observable();
                        context.self.context.getData({
                            uri: rowData[propertyName],
                            context: { data: value, type: property, self: context.self },
                            done: context.self.onNavigationPropertyLoaded
                        });
                        if (property.isMany) {
                            entity.elements[property.name] = ko.observable();
                        }
                    } else {
                        value = rowData[propertyName];
                    }
                    entity[property.name] = value;
                }

                entityData.rows.sort((left: any, right: any) => { //TODO: make more efficient
                    return parseInt(left.Id) == parseInt(right.Id) ? 0 : (parseInt(left.Id) < parseInt(right.Id) ? -1 : 1);
                });
                entityData.rows.push(entity);
            }

            if (entityData.rows().length == 0) {
                var row: Entity = new Entity(entityData.display());
                for (var i = 0; i < entityData.properties().length; i++) {
                    var property: EntityProperty = entityData.properties()[i];
                    row[property.name] = 'n/a';
                }
                entityData.rows.push(row);
            }
            entityData.allLoaded(true);
        }

        public onEntityLoaded(data: any, done: (entity: Entity) => void) {

            if (data != undefined) {

                var context: disco.core.viewmodel.requestContext = this.context;
                var entityData: EntityData = <EntityData>context.data;

                var entity: Entity;
                var tmp = disco.core.CollectionQuery.where(entityData.rows(),
                    (item: any, index: any) => {
                        return item.Id == data.Id;
                    });
                if (tmp.length > 0) {
                    entity = <Entity>tmp[0];
                }
                else {
                    entity = new Entity(entityData.display());
                    entity.uri = data['odata.id'];

                    for (var k = 0; k < entityData.properties().length; k++) {
                        var property: EntityProperty = entityData.properties()[k];
                        var propertyName = property.name;
                        var value: any;
                        if (property.isNavigation) {
                            propertyName = propertyName + '@odata.navigationLinkUrl';
                            value = ko.observable();
                            context.self.context.getData({
                                uri: data[propertyName],
                                context: { data: value, type: property, self: context.self },
                                done: context.self.onNavigationPropertyLoaded
                            });
                            if (property.isMany) {
                                entity.elements[property.name] = ko.observable();
                            }
                        } else {
                            value = data[propertyName];
                        }
                        entity[property.name] = value;
                    }

                    entityData.rows.push(entity);
                }

                done(entity);
            }
            else
                done(undefined);
        }

        public onEntitySetLoaded(data: any, done: (entitySet: EntityArray) => void) {
            var context: disco.core.viewmodel.requestContext = (<any>this).context;
            var entityData: EntityData = <EntityData>context.data;

            var entitySet: EntityArray = new EntityArray();
            entitySet.properties = entityData.properties;

            for (var i = 0; i < data.value.length; ++i) {
                context.self.onEntityLoaded.call(this, data.value[i], function (entity: Entity) {
                    if(entity != undefined)
                        entitySet.rows.push(entity);
                });
            }

            done(entitySet);
        }

        private getProperties(entity: Entity): EntityProperty[] {
            var properties: EntityProperty[] = [];
            for (var i = 0; i < entity.properties.length; i++) {
                var property: EntityProperty = entity.properties[i];

                if (property.name.indexOf('Id') > 0) {
                    // HINT: Don't handle foreign key association properties!
                    continue;
                }

                var entityProperty: EntityProperty = new EntityProperty();

                entityProperty.isNavigation = property.isNavigation || false;
                entityProperty.name = property.name;
                entityProperty.isMany = property.isMany || false;
                entityProperty.isNullable = property.isNullable || true;
                entityProperty.type = property.type;
                // TODO: As a Developer I want to improve getting the isKey property for derived sets so that the inherited value is reflected.
                entityProperty.isKey = property.isKey || false;

                properties.push(entityProperty);
            }

            var navigation: NavigationProperty[] = entity.navigationProperties;
            for (var i = 0; i < navigation.length; i++) {
                var entityProperty: EntityProperty = new EntityProperty();
                entityProperty.isNavigation = true;
                entityProperty.name = navigation[i].to.role;
                entityProperty.isMany = (navigation[i].to.multiplicity == '*');
                entityProperty.isNullable = (navigation[i].from.multiplicity != '1');
                entityProperty.type = navigation[i].to.type;
                entityProperty.isKey = false;

                properties.push(entityProperty);
            }

            return properties;
        }

        private getEntitySets(): EntitySet[] {
            var data = this.metadata();

            var entities = [];

            //first find full entity type (namespace.entityType)
            var fullEntityTypeName;
            var schemaIndex = 0;
            if (data.dataServices.schema.length > 1) { //hack for multiple schemas in $metadata
                schemaIndex = 1;
            }
            var entitySets = data.dataServices.schema[schemaIndex].entityContainer[0].entitySet;
            for (var i = 0; i < entitySets.length; i++) {
                var entitySet: EntitySet = new EntitySet();
                entitySet.name = entitySets[i].name;

                //remove namespace from fullEntityType
                var entityTypeName = this.removeNamespace(entitySets[i].entityType);

                //get properties collection
                var entityTypes = data.dataServices.schema[0].entityType;

                for (var j = 0; j < entityTypes.length; j++) {
                    if (entityTypes[j].name == entityTypeName) {

                        entitySet.type = new Entity(entitySet.name);
                        entitySet.type.name = entityTypes[j].name;
                        entitySet.type.abstract = entityTypes[j].abstract;

                        entitySet.type.properties = [];
                        if (undefined != entityTypes[j].property) {
                            var properties: EntityPropertyJson[] = entityTypes[j].property;
                            this.setProperties(entitySet, entityTypes[j]);
                        }

                        entitySet.type.navigationProperties = [];
                        if (undefined != entityTypes[j].navigationProperty) {
                            var navigationProperties: NavigationPropertyJson[] = entityTypes[j].navigationProperty;
                            this.setNavigationProperties(entitySet, navigationProperties);
                        }

                        if (undefined != entityTypes[j].baseType) {
                            var baseTypeName = this.removeNamespace(entityTypes[j].baseType);
                            var baseType: EntityJson = disco.core.CollectionQuery.single(entityTypes, (item, index) => {
                                return item.name == baseTypeName
                            });
                            if (undefined == entitySet.type.properties) {
                                entitySet.type.properties = [];
                            }
                            entitySet.type.properties = baseType.property.concat(entitySet.type.properties);

                            if (undefined != baseType.navigationProperty) {
                                var navigationProperties: NavigationPropertyJson[] = baseType.navigationProperty;
                                this.setNavigationProperties(entitySet, navigationProperties);
                            }
                        }

                        break;
                    }
                }

                if (entitySet.type.abstract == undefined || entitySet.type.abstract == 'false') {
                    entities.push(entitySet);
                }
            }

            return entities;
        }

        private setProperties(
            entitySet: EntitySet,
            entityType: EntityJson) {

            var properties: EntityPropertyJson[] = entityType.property
            for (var p = 0; p < properties.length; p++) {
                var property = properties[p];
                var entityProperty = new EntityProperty();
                entityProperty.isNavigation = entityProperty.isMany = false;
                entityProperty.name = property.name;
                entityProperty.isNullable = (property.nullable == 'true');
                entityProperty.type = property.type;
                // TODO: Enable multi key here!
                if (undefined != entityType.key) {
                    entityProperty.isKey = disco.core.CollectionQuery.contains(entityType.key.propertyRef, (item, index) => {
                        return item.name == entityProperty.name
                    });
                } else {
                    entityProperty.isKey = false;
                }

                entitySet.type.properties.push(entityProperty);
            }
        }

        private setNavigationProperties(
            entitySet: EntitySet,
            navigationProperties: NavigationPropertyJson[]) {

            var data = this.metadata()

            for (var k = 0; k < navigationProperties.length; k++) {
                var navigationProperty: NavigationPropertyJson = navigationProperties[k];

                var associationName = this.removeNamespace(navigationProperty.relationship);

                var associations: AssociationJson[] = data.dataServices.schema[0].association;
                for (var m = 0; m < associations.length; m++) {

                    if (associations[m].name == associationName) {
                        var fromEnd = this.getAssociation(associations[m], navigationProperty);
                        var toEnd = disco.core.CollectionQuery.single(associations[m].end, (item, index) => {
                            return item.role == navigationProperty.toRole
                        });

                        var navigation = <NavigationProperty>{
                            name: associationName,
                            from: fromEnd,
                            to: toEnd
                        };
                        entitySet.type.navigationProperties.push(navigation);

                        break;
                    }
                }
            }
        }

        private getAssociation(
            association: AssociationJson,
            navigationProperty: NavigationPropertyJson): Association {
            var result = disco.core.CollectionQuery.single(association.end, (item, index) => {
                return item.role == navigationProperty.fromRole
            });
            return result;
        }

        private removeNamespace(typeName: string): string {
            var data = this.metadata();
            return typeName.substr(data.dataServices.schema[0].namespace.length + 1)
        }
    }

    export class EntityArray {
        public rows: any = ko.observableArray([]);
        public properties: any = ko.observableArray([]);
    }

    export class EntityData extends EntityArray {
        public type: Entity;
        public display: any = ko.observable('');
        public details: any = ko.observableArray([]);
        public uri: any = ko.observable('');
        public allLoaded: any = ko.observable(false);
    }

    export class EntitySet {
        public name: string;
        public type: Entity;
    }

    export interface PropertyKey {
        propertyRef: any[];
    }

    export interface EntityJson {
        name: string;
        key: PropertyKey;
        abstract?: string;
        property: any[];
        navigationProperty: any[];
    }

    export class Entity {
        public uri: string;
        public name: string;
        public key: string;
        public type: string;
        public abstract: string;
        public properties: EntityProperty[];
        public elements : any = ko.observableArray();
        public navigationProperties: NavigationProperty[];
        constructor(public entitySet: string) { }
    }

    export interface EntityPropertyJson {
        name: string;
        type: string;
        nullable?: string;
    }

    export class EntityProperty {
        public name: string;
        public isInherited: boolean;
        public isKey: boolean;
        public isNullable: boolean;
        public isMany: boolean;
        public type: string;
        public isNavigation: boolean;
    }

    export interface NavigationPropertyJson {
        name: string;
        fromRole: string;
        toRole: string;
        relationship: string;
    }

    export interface AssociationEndJson {
        role: string;
        type: string;
        multiplicity: string;
    }

    export interface AssociationJson {
        name: string;
        end: AssociationEndJson[];
    }

    export class NavigationProperty {
        public name: string;
        public inherited: boolean;
        public from: Association;
        public to: Association;
    }

    export class Association {
        public role: string;
        public type: string;
        public multiplicity: string;
    }
}

module disco.views.home {

    export class index {
        public init(): void {
            var viewmodel = new disco.viewmodel.OntologyExplorer();
            ko.applyBindings(viewmodel);
        }
    }
}

jQuery(document).ready(() => {
    var view = new disco.views.home.index();
    view.init();
});