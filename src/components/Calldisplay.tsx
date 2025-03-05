// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address } from 'abitype';
import type { Chain, Hex } from 'viem';

import { Button, Divider } from '@heroui/react';
import React, { createContext, useContext, useState } from 'react';
import { useToggle } from 'react-use';

import { useMediaQuery } from '@mimir-wallet/hooks/useMediaQuery';
import { useParseCall } from '@mimir-wallet/hooks/useParseCall';
import { Operation } from '@mimir-wallet/safe/types';

import AddressRow from './AddressRow';
import DecodeCallData from './DecodeCallData';
import FormatBalance from './FormatBalance';
import FunctionArgs from './FunctionArgs';
import Multisend from './Multisend';

export interface CallDisplayProps {
  chain: Chain;
  from?: Address;
  data: Hex;
  to?: Address;
  operation?: Operation;
  value?: bigint;
}

const context = createContext<{ decodeSuccess: boolean; setDecodeSuccess: (decodeSuccess: boolean) => void }>({
  decodeSuccess: false,
  setDecodeSuccess: () => {}
});

function Item({ label, content }: { label: React.ReactNode; content: React.ReactNode }) {
  return (
    <div className='grid grid-cols-11 sm:grid-cols-10 text-tiny'>
      <div className='col-span-4 sm:col-span-3 font-bold self-center tex-foreground'>{label}</div>
      <div className='col-span-7 self-center text-foreground/50 max-w-full overflow-hidden text-ellipsis'>
        {content}
      </div>
    </div>
  );
}

function Fallback({ data }: { data: Hex }) {
  const [isOpen, toggleOpen] = useToggle(false);
  const { setDecodeSuccess } = useContext(context);

  const handleSuccess = () => {
    setDecodeSuccess(true);

    setTimeout(() => {
      setDecodeSuccess(false);
    }, 1000);
  };

  return (
    <div className='bg-secondary rounded-small p-2.5 space-y-1'>
      <Item
        label='Call Data'
        content={
          <div className='flex items-center gap-2 text-foreground/50'>
            View Details
            <Button color='primary' variant='bordered' radius='full' size='sm' onClick={toggleOpen}>
              Decode
            </Button>
            <DecodeCallData data={data} isOpen={isOpen} onClose={toggleOpen} onSuccess={handleSuccess} />
          </div>
        }
      />
    </div>
  );
}

function CallDisplay({ chain, data, from, to, operation, value = 0n }: CallDisplayProps) {
  const [dataSize, parsed, isParsed] = useParseCall(data);
  const upSm = useMediaQuery('sm');
  const [decodeSuccess, setDecodeSuccess] = useState(false);

  const nodes: React.ReactNode[] = [];

  if (parsed.functionName === 'multiSend') {
    nodes.push(<Multisend chain={chain} from={from} parsed={parsed} data={data} />);
  } else if (dataSize !== 0) {
    nodes.push(
      isParsed ? (
        <div className='space-y-3' key='function args'>
          <FunctionArgs chain={chain} data={data} />
        </div>
      ) : (
        <Fallback data={data} />
      )
    );
  }

  return (
    <context.Provider value={{ decodeSuccess, setDecodeSuccess }}>
      <div
        data-success={decodeSuccess}
        className='p-0 rounded-medium bg-transparent space-y-4 data-[success=true]:bg-success/50 data-[success=true]:p-3 transition-all duration-300'
      >
        {dataSize > 0 ? (
          <div className='flex flex-wrap items-center gap-2 text-medium'>
            {operation ? (
              operation === Operation.DelegateCall ? (
                <b className='text-danger'>⚠️ DelegateCall</b>
              ) : (
                <b className='text-primary'>Call</b>
              )
            ) : null}
            <span>{parsed.functionName}</span>
            {to ? (
              <>
                <b>On</b>
                <AddressRow withCopy showFull={upSm} withExplorer address={to} iconSize={20} chain={chain} />
              </>
            ) : null}
          </div>
        ) : null}

        {value > 0n ? (
          <div className='flex flex-wrap items-center gap-2 text-medium'>
            <b className='text-primary'>Send</b>
            <FormatBalance value={value} showSymbol {...chain.nativeCurrency} />
            <b>To</b>
            <AddressRow withCopy showFull={upSm} withExplorer address={to} iconSize={20} chain={chain} />
          </div>
        ) : null}

        <Divider />

        {nodes}
      </div>
    </context.Provider>
  );
}

export default React.memo(CallDisplay);
