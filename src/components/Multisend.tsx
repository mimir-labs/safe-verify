// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address, Chain, Hex } from 'viem';
import type { CallFunctions, ParsedCall } from '@mimir-wallet/hooks/types';

import { TRANSITION_VARIANTS } from '@heroui/framer-utils';
import { Button } from '@heroui/react';
import { domAnimation, LazyMotion, motion, useWillChange } from 'framer-motion';
import React, { useState } from 'react';

import ArrowDown from '@mimir-wallet/assets/svg/ArrowDown.svg?react';
import { useParseCall, useParseMultisend } from '@mimir-wallet/hooks/useParseCall';
import { Operation } from '@mimir-wallet/safe/types';

import CallDetails from './CallDetails';
import Calldisplay from './Calldisplay';
import FormatBalance from './FormatBalance';
import FunctionArgs from './FunctionArgs';

function Item({
  chain,
  from,
  index,
  to,
  value,
  data,
  operation,
  isOpen,
  toggleOpen
}: {
  chain: Chain;
  index: number;
  data: Hex;
  to: Address;
  from?: Address;
  value: bigint;
  operation: Operation;
  isOpen: boolean;
  toggleOpen: () => void;
}) {
  const [dataSize, parsed] = useParseCall(data);
  const multisend = useParseMultisend(parsed);
  const willChange = useWillChange();

  const Top = (
    <div className='cursor-pointer h-10 px-3 grid grid-cols-11 text-tiny' onClick={toggleOpen}>
      <div className='col-span-1 flex items-center'>{index}</div>
      <div className='col-span-4 flex items-center'>{parsed.functionName}</div>
      <div className='col-span-4 flex items-center'>
        {dataSize ? (
          <CallDetails multisend={multisend} parsed={parsed} />
        ) : (
          <FormatBalance
            prefix='- '
            value={value}
            decimals={chain?.nativeCurrency.decimals}
            showSymbol
            symbol={chain?.nativeCurrency.symbol}
          />
        )}
      </div>
      <div
        data-alert={operation === Operation.DelegateCall}
        className='col-span-1 flex items-center text-primary data-[alert=true]:text-danger'
      >
        {Operation[operation]}
      </div>
      <div className='col-span-1 flex items-center justify-end'>
        <Button
          data-open={isOpen}
          onPress={toggleOpen}
          size='sm'
          radius='full'
          variant='light'
          isIconOnly
          className='justify-self-end data-[open=true]:rotate-180 w-6 h-6 min-w-6'
          color='primary'
        >
          <ArrowDown />
        </Button>
      </div>
    </div>
  );

  return (
    <div data-open={isOpen} className='rounded-medium overflow-hidden transition-all bg-secondary'>
      {Top}
      <LazyMotion features={domAnimation}>
        <motion.div
          animate={isOpen ? 'enter' : 'exit'}
          exit='exit'
          initial='exit'
          style={{ overflowY: 'hidden', willChange }}
          variants={TRANSITION_VARIANTS.collapse}
        >
          <div className='mb-2.5 ml-2.5 mr-2.5 bg-white rounded-medium p-2.5 space-y-2.5'>
            <Calldisplay chain={chain} operation={operation} from={from} data={data} to={to} value={value} />
          </div>
        </motion.div>
      </LazyMotion>
    </div>
  );
}

function Multisend({
  chain,
  parsed,
  from,
  data
}: {
  chain: Chain;
  parsed: ParsedCall<CallFunctions>;
  from?: Address;
  data: Hex;
}) {
  const txs = useParseMultisend(parsed);
  const [isOpen, setOpen] = useState<Record<number, boolean>>({});

  if (!txs) {
    return <FunctionArgs chain={chain} data={data} />;
  }

  return (
    <div className='space-y-2.5'>
      <div className='flex items-center justify-between font-bold text-small'>
        Actions
        <div>
          <Button
            color='primary'
            variant='light'
            size='sm'
            onPress={() =>
              setOpen(
                Array.from({ length: txs.length }).reduce<Record<number, boolean>>((result, _, index) => {
                  result[index] = true;

                  return result;
                }, {})
              )
            }
          >
            Expand all
          </Button>
          <Button
            color='primary'
            variant='light'
            size='sm'
            onPress={() =>
              setOpen(
                Array.from({ length: txs.length }).reduce<Record<number, boolean>>((result, _, index) => {
                  result[index] = false;

                  return result;
                }, {})
              )
            }
          >
            Collapse all
          </Button>
        </div>
      </div>
      {txs.map((tx, index) => (
        <Item
          chain={chain}
          from={from}
          data={tx.data}
          value={tx.value}
          to={tx.to}
          index={index + 1}
          key={index}
          isOpen={!!isOpen[index]}
          operation={tx.operation}
          toggleOpen={() =>
            setOpen((values) => ({
              ...values,
              [index]: !values[index]
            }))
          }
        />
      ))}
    </div>
  );
}

export default React.memo(Multisend);
