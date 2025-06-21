import type { WeaveAction } from '@genie-nexus/types';
import { Text } from '@mantine/core';
import { AddRequestHeaderBlock } from '../pipeline-blocks/add-request-header-block';
import { AddResponseHeaderBlock } from '../pipeline-blocks/add-response-header-block';
import { DelayBlock } from '../pipeline-blocks/delay-block';
import { FilterBlock } from '../pipeline-blocks/filter-block';
import { LogBlock } from '../pipeline-blocks/log-block';
import { RemoveRequestHeaderBlock } from '../pipeline-blocks/remove-request-header-block';
import { RemoveResponseHeaderBlock } from '../pipeline-blocks/remove-response-header-block';
import { SetProviderBlock } from '../pipeline-blocks/set-provider-block';
import { SetRequestHeaderBlock } from '../pipeline-blocks/set-request-header-block';
import { SetResponseHeaderBlock } from '../pipeline-blocks/set-response-header-block';
import { TransformDataBlock } from '../pipeline-blocks/transform-data-block';
import { UpdateResponseBodyBlock } from '../pipeline-blocks/update-response-body-block';
import { UpdateResponseStatusCodeBlock } from '../pipeline-blocks/update-response-status-code-block';

type Properties = {
  action: WeaveAction;
  onChange: (action: WeaveAction) => void;
};

export function WeaveAction({ action, onChange }: Properties) {
  switch (action.type) {
    case 'addRequestHeader':
      return <AddRequestHeaderBlock action={action} onChange={onChange} />;
    case 'removeRequestHeader':
      return <RemoveRequestHeaderBlock action={action} onChange={onChange} />;
    case 'setRequestHeader':
      return <SetRequestHeaderBlock action={action} onChange={onChange} />;
    case 'addResponseHeader':
      return <AddResponseHeaderBlock action={action} onChange={onChange} />;
    case 'removeResponseHeader':
      return <RemoveResponseHeaderBlock action={action} onChange={onChange} />;
    case 'setResponseHeader':
      return <SetResponseHeaderBlock action={action} onChange={onChange} />;
    case 'updateResponseBody':
      return <UpdateResponseBodyBlock action={action} onChange={onChange} />;
    case 'updateResponseStatusCode':
      return (
        <UpdateResponseStatusCodeBlock action={action} onChange={onChange} />
      );
    case 'transformData':
      return <TransformDataBlock action={action} onChange={onChange} />;
    case 'filter':
      return <FilterBlock action={action} onChange={onChange} />;
    case 'delay':
      return <DelayBlock action={action} onChange={onChange} />;
    case 'log':
      return <LogBlock action={action} onChange={onChange} />;
    case 'setProvider':
      return <SetProviderBlock action={action} onChange={onChange} />;
    default:
      return <Text c="dimmed">No editable fields for this action.</Text>;
  }
}
