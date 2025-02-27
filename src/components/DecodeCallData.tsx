// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@heroui/react';
import { useState } from 'react';
import { decodeFunctionData, type Hex, parseAbiItem } from 'viem';

import { events } from '@mimir-wallet/events';
import { useInput } from '@mimir-wallet/hooks/useInput';

async function importAbi(signatures: string) {
  return fetch(`https://www.4byte.directory/api/v1/signatures/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text_signature: signatures
    })
  });
}

function DecodeCallData({
  data,
  isOpen,
  onClose,
  onSuccess
}: {
  data: Hex;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [signatures, setSignatures] = useInput('');
  const [error, setError] = useState<string>('');

  const handleSuccess = () => {
    setSignatures('');
    setError('');
    onClose();
    importAbi(signatures).finally(() => {
      events.emit('refetch_call_data', data);
      onSuccess?.();
    });
  };

  const handleDecode = () => {
    try {
      const abiItem = parseAbiItem(`function ${signatures}` as string);

      if (abiItem.type === 'function') {
        decodeFunctionData({
          abi: [abiItem],
          data
        });
        handleSuccess();
      }
    } catch {
      setError(`Encoded function signature "${data.slice(0, 10)}" not found on ABI.
Make sure you are using the correct ABI and that the function exists on it.`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} disableAnimation>
      <ModalContent>
        <ModalHeader className='font-bold text-xl'>Decode Call Data</ModalHeader>
        <Divider />
        <ModalBody className='flex flex-col gap-y-5 py-5'>
          <Input
            label='Call'
            labelPlacement='outside'
            variant='bordered'
            placeholder='e.g. transfer(address,uint256)'
            value={signatures}
            onChange={setSignatures}
          />
          {error ? <Textarea color='danger' disabled value={error} /> : null}
        </ModalBody>
        <Divider />
        <ModalFooter>
          <Button color='primary' radius='full' fullWidth onClick={handleDecode}>
            Decode
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DecodeCallData;
