var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var disco;
(function (disco) {
    var viewmodel;
    (function (viewmodel) {
        var Metadata = (function () {
            function Metadata() {
            }
            return Metadata;
        }());
        viewmodel.Metadata = Metadata;
        var OntologyExplorer = (function (_super) {
            __extends(OntologyExplorer, _super);
            function OntologyExplorer() {
                var _this = this;
                _super.call(this);
                this.metadata = ko.observable();
                this.entitySets = ko.observableArray();
                this.entityCollection = ko.observableArray();
                this.errorCollection = ko.observableArray();
                this.onShowDetailedDataClick = function ($data, $parents) {
                    var detailsEntityData = $parents[2];
                    var entityData = disco.core.CollectionQuery.single(_this.entityCollection(), function (item, index) {
                        return item.display() == $data.entitySet;
                    });
                    if (!disco.core.CollectionQuery.contains(detailsEntityData.details(), function (item, index) {
                        return (item.entityData.display() == entityData.display()) && (item.data.Id == $data.Id);
                    })) {
                        var entitySet = disco.core.CollectionQuery.single(_this.entitySets(), function (item, index) {
                            return item.name == $data.entitySet;
                        });
                        var entityCollection = [];
                        for (var i = 0; i < entitySet.type.navigationProperties.length; i++) {
                            var navigationProperty = entitySet.type.navigationProperties[i];
                            var navigationEntityData = disco.core.CollectionQuery.single(_this.entityCollection(), function (item, index) {
                                return 'Disco.Ontology.' + item.type.name == navigationProperty.to.type;
                            });
                            entityCollection.push(navigationEntityData);
                        }
                        var details = _this.createDetail("one", entityCollection, entityData, $data);
                        detailsEntityData.details.push(details);
                    }
                };
                this.onShowPropertyDetailsClick = function ($data, $parents, data, event) {
                    if (!$data.isNavigation)
                        return;
                    var $parent = $parents[0];
                    var $grandparent = $parents[1];
                    var entity = $parent.data;
                    var detailsEntityData = disco.core.CollectionQuery.single(_this.entityCollection(), function (item, index) {
                        return item.display() == $grandparent.type.entitySet;
                    });
                    var entitySet = disco.core.CollectionQuery.single(_this.entitySets(), function (item, index) {
                        return 'Disco.Ontology.' + item.type.name == $data.type;
                    });
                    var entityData = disco.core.CollectionQuery.single(_this.entityCollection(), function (item, index) {
                        return item.display() == entitySet.type.entitySet;
                    });
                    var entityCollection = [];
                    for (var i = 0; i < entitySet.type.navigationProperties.length; i++) {
                        var navigationProperty = entitySet.type.navigationProperties[i];
                        var navigationEntityData = disco.core.CollectionQuery.single(_this.entityCollection(), function (item, index) {
                            return 'Disco.Ontology.' + item.type.name == navigationProperty.to.type;
                        });
                        entityCollection.push(navigationEntityData);
                    }
                    var uri = entity.uri + '/' + $data.name;
                    if ($data.isMany) {
                        if (entity.elements[$data.name]() == undefined) {
                            _this.loadEntitySet(uri, entityData, function (entitySet) {
                                entity.elements[$data.name](entitySet);
                            });
                        }
                        else
                            jQuery(event.currentTarget).next().slideToggle();
                    }
                    else {
                        _this.loadEntity(uri, entityData, function (entity) {
                            if (entity != undefined) {
                                if (!disco.core.CollectionQuery.contains(detailsEntityData.details(), function (item, index) {
                                    return (item.entityData.display() == entityData.display()) && (item.data.Id == entity['Id']);
                                })) {
                                    var details = _this.createDetail("one", entityCollection, entityData, entity);
                                    detailsEntityData.details.push(details);
                                }
                            }
                        });
                    }
                };
                this.onShowEntitySetDataClick = function (data, element) {
                    if (!data.allLoaded()) {
                        _this.requestData({
                            uri: data.uri(),
                            context: { data: data },
                            done: _this.onEntityDataLoaded
                        });
                    }
                    else {
                        _this.onCollapsableHeadlineClick(data, element);
                    }
                };
                this.loadEntitySet = function (uri, data, done) {
                    var self = _this;
                    _this.requestData({
                        uri: uri,
                        context: { data: data },
                        done: function (data) {
                            self.onEntitySetLoaded.call(this, data, done);
                        }
                    });
                };
                this.loadEntity = function (uri, data, done) {
                    var self = _this;
                    _this.requestData({
                        uri: uri,
                        context: { data: data },
                        done: function (data) {
                            self.onEntityLoaded.call(this, data, done);
                        }
                    });
                };
                this.onMetadataClick = function () {
                    _this.entityCollection.removeAll();
                    _this.errorCollection.removeAll();
                    _this.isBusy(true);
                    _this.context.getMetadata(_this.getServiceUri() + '$metadata', _this.metadata, function () {
                        _this.setMetadata();
                        _this.setEntities();
                        _this.isBusy(false);
                    }, function (error) {
                        _this.onAjaxError(error);
                        _this.isBusy(false);
                    });
                };
                this.setMetadata = function () {
                    var data = _this.metadata();
                    disco.core.JsonViewer.createTree(jQuery('#jsonViewer'), data);
                };
                this.setEntities = function () {
                    var entityCollection = [];
                    var data = _this.metadata();
                    var entitySets = _this.getEntitySets();
                    _this.entitySets(entitySets);
                    for (var i = 0; i < entitySets.length; i++) {
                        var entitySet = entitySets[i];
                        if (entitySet.type.abstract == 'true') {
                            continue;
                        }
                        var entityData = new EntityData();
                        entityData.type = entitySet.type;
                        entityData.display(entitySet.name);
                        entityData.properties(_this.getProperties(entitySet.type));
                        var uri = _this.getServiceUri() + entitySet.name;
                        entityData.uri(uri);
                        entityCollection.push(entityData);
                    }
                    _this.entityCollection(entityCollection);
                    var json = ko.toJSON(entityCollection, null, '   ');
                    jQuery('#entities').html(json);
                };
            }
            OntologyExplorer.prototype.createDetail = function (detailMultiplicity, entityCollection, entityData, data) {
                return { detailMultiplicity: detailMultiplicity, entityCollection: entityCollection, entityData: entityData, data: data };
            };
            OntologyExplorer.prototype.onNavigationPropertyLoaded = function (data) {
                var context = this.context;
                var value = context.data;
                context.self.writeNavigationPropertyField(data, value);
            };
            OntologyExplorer.prototype.writeNavigationPropertyField = function (data, propertyField) {
                var value = propertyField;
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
            };
            OntologyExplorer.prototype.onEntityDataLoaded = function (data) {
                var context = this.context;
                var entityData = context.data;
                for (var j = 0; j < data.value.length; j++) {
                    var entity = new Entity(entityData.display());
                    var rowData = data.value[j];
                    entity.uri = rowData['odata.id'];
                    if (disco.core.CollectionQuery.contains(entityData.rows(), function (item, index) {
                        return item.Id == rowData.Id;
                    }))
                        continue;
                    for (var k = 0; k < entityData.properties().length; k++) {
                        var property = entityData.properties()[k];
                        var propertyName = property.name;
                        var value;
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
                        }
                        else {
                            value = rowData[propertyName];
                        }
                        entity[property.name] = value;
                    }
                    entityData.rows.sort(function (left, right) {
                        return parseInt(left.Id) == parseInt(right.Id) ? 0 : (parseInt(left.Id) < parseInt(right.Id) ? -1 : 1);
                    });
                    entityData.rows.push(entity);
                }
                if (entityData.rows().length == 0) {
                    var row = new Entity(entityData.display());
                    for (var i = 0; i < entityData.properties().length; i++) {
                        var property = entityData.properties()[i];
                        row[property.name] = 'n/a';
                    }
                    entityData.rows.push(row);
                }
                entityData.allLoaded(true);
            };
            OntologyExplorer.prototype.onEntityLoaded = function (data, done) {
                if (data != undefined) {
                    var context = this.context;
                    var entityData = context.data;
                    var entity;
                    var tmp = disco.core.CollectionQuery.where(entityData.rows(), function (item, index) {
                        return item.Id == data.Id;
                    });
                    if (tmp.length > 0) {
                        entity = tmp[0];
                    }
                    else {
                        entity = new Entity(entityData.display());
                        entity.uri = data['odata.id'];
                        for (var k = 0; k < entityData.properties().length; k++) {
                            var property = entityData.properties()[k];
                            var propertyName = property.name;
                            var value;
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
                            }
                            else {
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
            };
            OntologyExplorer.prototype.onEntitySetLoaded = function (data, done) {
                var context = this.context;
                var entityData = context.data;
                var entitySet = new EntityArray();
                entitySet.properties = entityData.properties;
                for (var i = 0; i < data.value.length; ++i) {
                    context.self.onEntityLoaded.call(this, data.value[i], function (entity) {
                        if (entity != undefined)
                            entitySet.rows.push(entity);
                    });
                }
                done(entitySet);
            };
            OntologyExplorer.prototype.getProperties = function (entity) {
                var properties = [];
                for (var i = 0; i < entity.properties.length; i++) {
                    var property = entity.properties[i];
                    if (property.name.indexOf('Id') > 0) {
                        continue;
                    }
                    var entityProperty = new EntityProperty();
                    entityProperty.isNavigation = property.isNavigation || false;
                    entityProperty.name = property.name;
                    entityProperty.isMany = property.isMany || false;
                    entityProperty.isNullable = property.isNullable || true;
                    entityProperty.type = property.type;
                    entityProperty.isKey = property.isKey || false;
                    properties.push(entityProperty);
                }
                var navigation = entity.navigationProperties;
                for (var i = 0; i < navigation.length; i++) {
                    var entityProperty = new EntityProperty();
                    entityProperty.isNavigation = true;
                    entityProperty.name = navigation[i].to.role;
                    entityProperty.isMany = (navigation[i].to.multiplicity == '*');
                    entityProperty.isNullable = (navigation[i].from.multiplicity != '1');
                    entityProperty.type = navigation[i].to.type;
                    entityProperty.isKey = false;
                    properties.push(entityProperty);
                }
                return properties;
            };
            OntologyExplorer.prototype.getEntitySets = function () {
                var data = this.metadata();
                var entities = [];
                var fullEntityTypeName;
                var schemaIndex = 0;
                if (data.dataServices.schema.length > 1) {
                    schemaIndex = 1;
                }
                var entitySets = data.dataServices.schema[schemaIndex].entityContainer[0].entitySet;
                for (var i = 0; i < entitySets.length; i++) {
                    var entitySet = new EntitySet();
                    entitySet.name = entitySets[i].name;
                    var entityTypeName = this.removeNamespace(entitySets[i].entityType);
                    var entityTypes = data.dataServices.schema[0].entityType;
                    for (var j = 0; j < entityTypes.length; j++) {
                        if (entityTypes[j].name == entityTypeName) {
                            entitySet.type = new Entity(entitySet.name);
                            entitySet.type.name = entityTypes[j].name;
                            entitySet.type.abstract = entityTypes[j].abstract;
                            entitySet.type.properties = [];
                            if (undefined != entityTypes[j].property) {
                                var properties = entityTypes[j].property;
                                this.setProperties(entitySet, entityTypes[j]);
                            }
                            entitySet.type.navigationProperties = [];
                            if (undefined != entityTypes[j].navigationProperty) {
                                var navigationProperties = entityTypes[j].navigationProperty;
                                this.setNavigationProperties(entitySet, navigationProperties);
                            }
                            if (undefined != entityTypes[j].baseType) {
                                var baseTypeName = this.removeNamespace(entityTypes[j].baseType);
                                var baseType = disco.core.CollectionQuery.single(entityTypes, function (item, index) {
                                    return item.name == baseTypeName;
                                });
                                if (undefined == entitySet.type.properties) {
                                    entitySet.type.properties = [];
                                }
                                entitySet.type.properties = baseType.property.concat(entitySet.type.properties);
                                if (undefined != baseType.navigationProperty) {
                                    var navigationProperties = baseType.navigationProperty;
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
            };
            OntologyExplorer.prototype.setProperties = function (entitySet, entityType) {
                var properties = entityType.property;
                for (var p = 0; p < properties.length; p++) {
                    var property = properties[p];
                    var entityProperty = new EntityProperty();
                    entityProperty.isNavigation = entityProperty.isMany = false;
                    entityProperty.name = property.name;
                    entityProperty.isNullable = (property.nullable == 'true');
                    entityProperty.type = property.type;
                    if (undefined != entityType.key) {
                        entityProperty.isKey = disco.core.CollectionQuery.contains(entityType.key.propertyRef, function (item, index) {
                            return item.name == entityProperty.name;
                        });
                    }
                    else {
                        entityProperty.isKey = false;
                    }
                    entitySet.type.properties.push(entityProperty);
                }
            };
            OntologyExplorer.prototype.setNavigationProperties = function (entitySet, navigationProperties) {
                var data = this.metadata();
                for (var k = 0; k < navigationProperties.length; k++) {
                    var navigationProperty = navigationProperties[k];
                    var associationName = this.removeNamespace(navigationProperty.relationship);
                    var associations = data.dataServices.schema[0].association;
                    for (var m = 0; m < associations.length; m++) {
                        if (associations[m].name == associationName) {
                            var fromEnd = this.getAssociation(associations[m], navigationProperty);
                            var toEnd = disco.core.CollectionQuery.single(associations[m].end, function (item, index) {
                                return item.role == navigationProperty.toRole;
                            });
                            var navigation = {
                                name: associationName,
                                from: fromEnd,
                                to: toEnd
                            };
                            entitySet.type.navigationProperties.push(navigation);
                            break;
                        }
                    }
                }
            };
            OntologyExplorer.prototype.getAssociation = function (association, navigationProperty) {
                var result = disco.core.CollectionQuery.single(association.end, function (item, index) {
                    return item.role == navigationProperty.fromRole;
                });
                return result;
            };
            OntologyExplorer.prototype.removeNamespace = function (typeName) {
                var data = this.metadata();
                return typeName.substr(data.dataServices.schema[0].namespace.length + 1);
            };
            return OntologyExplorer;
        }(disco.core.viewmodel.Base));
        viewmodel.OntologyExplorer = OntologyExplorer;
        var EntityArray = (function () {
            function EntityArray() {
                this.rows = ko.observableArray([]);
                this.properties = ko.observableArray([]);
            }
            return EntityArray;
        }());
        viewmodel.EntityArray = EntityArray;
        var EntityData = (function (_super) {
            __extends(EntityData, _super);
            function EntityData() {
                _super.apply(this, arguments);
                this.display = ko.observable('');
                this.details = ko.observableArray([]);
                this.uri = ko.observable('');
                this.allLoaded = ko.observable(false);
            }
            return EntityData;
        }(EntityArray));
        viewmodel.EntityData = EntityData;
        var EntitySet = (function () {
            function EntitySet() {
            }
            return EntitySet;
        }());
        viewmodel.EntitySet = EntitySet;
        var Entity = (function () {
            function Entity(entitySet) {
                this.entitySet = entitySet;
                this.elements = ko.observableArray();
            }
            return Entity;
        }());
        viewmodel.Entity = Entity;
        var EntityProperty = (function () {
            function EntityProperty() {
            }
            return EntityProperty;
        }());
        viewmodel.EntityProperty = EntityProperty;
        var NavigationProperty = (function () {
            function NavigationProperty() {
            }
            return NavigationProperty;
        }());
        viewmodel.NavigationProperty = NavigationProperty;
        var Association = (function () {
            function Association() {
            }
            return Association;
        }());
        viewmodel.Association = Association;
    })(viewmodel = disco.viewmodel || (disco.viewmodel = {}));
})(disco || (disco = {}));
var disco;
(function (disco) {
    var views;
    (function (views) {
        var home;
        (function (home) {
            var index = (function () {
                function index() {
                }
                index.prototype.init = function () {
                    var viewmodel = new disco.viewmodel.OntologyExplorer();
                    ko.applyBindings(viewmodel);
                };
                return index;
            }());
            home.index = index;
        })(home = views.home || (views.home = {}));
    })(views = disco.views || (disco.views = {}));
})(disco || (disco = {}));
jQuery(document).ready(function () {
    var view = new disco.views.home.index();
    view.init();
});
