import { BetterAuthDbSchema, FieldType } from 'better-auth/db';
import { EntityDefinition, SuperSave } from 'supersave';

function mapFieldToFilterSortFieldType(type: FieldType) {
  switch (type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'string';
  }

  throw new Error(`Unsupported field type: ${type}`);
}

export async function mapSchemaToEntity(
  superSave: SuperSave,
  schema: BetterAuthDbSchema[string],
) {
  const entity: EntityDefinition = {
    namespace: 'auth',
    name: schema.modelName,
    filterSortFields: {},
    template: {},
    relations: [],
  };

  for (const [name, field] of Object.entries(schema.fields)) {
    if (field.sortable) {
      entity.filterSortFields![name] = mapFieldToFilterSortFieldType(
        field.type,
      );
    }
  }

  return superSave.addEntity(entity);
}
