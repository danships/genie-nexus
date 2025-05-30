import { Action } from '@genie-nexus/types';
import { Button, Collapse, Group, Modal, Stack, Text } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import { BLOCK_TYPES } from './types';

type AddBlockModalProps = {
  opened: boolean;
  onClose: () => void;
  onAdd: (type: Action['type']) => void;
  eventType: 'request' | 'response';
};

type GroupType = 'request' | 'response' | 'generic';

export function AddBlockModal({
  opened,
  onClose,
  onAdd,
  eventType,
}: AddBlockModalProps) {
  const [expandedGroups, setExpandedGroups] = useState<
    Record<GroupType, boolean>
  >({
    request: true,
    response: true,
    generic: true,
  });

  const toggleGroup = (group: GroupType) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const requestBlocks = BLOCK_TYPES.filter(
    (block) => block.group === 'request'
  );
  const responseBlocks = BLOCK_TYPES.filter(
    (block) => block.group === 'response'
  );
  const genericBlocks = BLOCK_TYPES.filter(
    (block) => block.group === 'generic'
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Block Type"
      size="md"
    >
      <Stack>
        {/* Request actions - show for request event */}
        {eventType === 'request' && (
          <>
            <Group
              onClick={() => toggleGroup('request')}
              style={{ cursor: 'pointer' }}
            >
              {expandedGroups['request'] ? (
                <IconChevronDown size={16} />
              ) : (
                <IconChevronRight size={16} />
              )}
              <Text fw={500}>Request Actions ({requestBlocks.length})</Text>
            </Group>
            <Collapse in={expandedGroups['request']}>
              <Stack pl="md">
                {requestBlocks.map((block) => (
                  <Button
                    key={block.type}
                    leftSection={<block.icon size={16} />}
                    variant="light"
                    onClick={() => onAdd(block.type)}
                  >
                    {block.label}
                  </Button>
                ))}
              </Stack>
            </Collapse>
          </>
        )}

        {/* Response actions - show for response event */}
        {eventType === 'response' && (
          <>
            <Group
              onClick={() => toggleGroup('response')}
              style={{ cursor: 'pointer' }}
            >
              {expandedGroups['response'] ? (
                <IconChevronDown size={16} />
              ) : (
                <IconChevronRight size={16} />
              )}
              <Text fw={500}>Response Actions ({responseBlocks.length})</Text>
            </Group>
            <Collapse in={expandedGroups['response']}>
              <Stack pl="md">
                {responseBlocks.map((block) => (
                  <Button
                    key={block.type}
                    leftSection={<block.icon size={16} />}
                    variant="light"
                    onClick={() => onAdd(block.type)}
                  >
                    {block.label}
                  </Button>
                ))}
              </Stack>
            </Collapse>
          </>
        )}

        {/* Generic actions - show for both events */}
        <Group
          onClick={() => toggleGroup('generic')}
          style={{ cursor: 'pointer' }}
        >
          {expandedGroups['generic'] ? (
            <IconChevronDown size={16} />
          ) : (
            <IconChevronRight size={16} />
          )}
          <Text fw={500}>Generic Actions ({genericBlocks.length})</Text>
        </Group>
        <Collapse in={expandedGroups['generic']}>
          <Stack pl="md">
            {genericBlocks.map((block) => (
              <Button
                key={block.type}
                leftSection={<block.icon size={16} />}
                variant="light"
                onClick={() => onAdd(block.type)}
              >
                {block.label}
              </Button>
            ))}
          </Stack>
        </Collapse>
      </Stack>
    </Modal>
  );
}
