// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain, Hex } from 'viem';

import { Alert, Card, CardBody, CardHeader, Divider } from '@heroui/react';

import AddressRow from '@mimir-wallet/components/AddressRow';
import Bytes from '@mimir-wallet/components/Bytes';
import FormatBalance from '@mimir-wallet/components/FormatBalance';
import FunctionArgs from '@mimir-wallet/components/FunctionArgs';
import { useParseCall } from '@mimir-wallet/hooks/useParseCall';
import { Operation, type SafeTransaction } from '@mimir-wallet/safe/types';

function Item({ label, content }: { label: React.ReactNode; content: React.ReactNode }) {
  return (
    <div className='grid grid-cols-10 text-tiny'>
      <div className='col-span-3 font-bold self-center tex-foreground'>{label}</div>
      <div className='col-span-7 self-center text-foreground/50 max-w-full overflow-hidden text-ellipsis'>
        {content}
      </div>
    </div>
  );
}

function CallDataDecode({ hash, safeTx, chain }: { hash: Hex; safeTx: SafeTransaction; chain: Chain }) {
  const [dataSize, parsed] = useParseCall(safeTx.data);

  const details = (
    <div className='bg-secondary rounded-small p-2.5 space-y-1'>
      <Item label='Hash' content={hash} />
      <Item
        label='To'
        content={<AddressRow showFull withCopy withExplorer iconSize={18} chain={chain} address={safeTx.to} />}
      />
      <Item label='Value' content={<FormatBalance value={safeTx.value} showSymbol {...chain.nativeCurrency} />} />
      <Item label='Operation' content={Operation[safeTx.operation]} />
      <Item label='safeTxGas' content={<FormatBalance value={safeTx.safeTxGas} showSymbol={false} />} />
      <Item label='baseGas' content={<FormatBalance value={safeTx.baseGas} showSymbol={false} />} />
      <Item
        label='refundReceiver'
        content={
          <AddressRow showFull withCopy withExplorer iconSize={18} chain={chain} address={safeTx.refundReceiver} />
        }
      />
      <Item label='Raw Data' content={<Bytes data={safeTx.data} />} />
    </div>
  );

  return (
    <Card className='p-5 border-1 border-secondary space-y-5'>
      <CardHeader className='p-0'>
        <h4 className='text-center text-xl font-bold'>Call Data Decode</h4>
      </CardHeader>
      <Divider />
      <CardBody className='p-0 space-y-5'>
        <div className='space-y-4'>
          {dataSize > 0 ? (
            <div className='flex items-center gap-2 text-medium'>
              <b className='text-primary'>{safeTx.operation === Operation.Call ? 'Call' : 'DelegateCall'}</b>
              <span>{parsed.functionName}</span>
              <b>On</b>
              <AddressRow withCopy showFull withExplorer address={safeTx.to} iconSize={20} chain={chain} />
            </div>
          ) : safeTx.operation === Operation.DelegateCall ? (
            <Alert variant='bordered' color='warning'>
              <b>Warning:</b> This is a delegate call.
            </Alert>
          ) : null}

          {safeTx.value > 0n ? (
            <div className='flex items-center gap-2 text-medium'>
              <b className='text-primary'>Send</b>
              <FormatBalance value={safeTx.value} showSymbol {...chain.nativeCurrency} />
              <b>To</b>
              <AddressRow withCopy showFull withExplorer address={safeTx.to} iconSize={20} chain={chain} />
            </div>
          ) : null}

          {dataSize > 0 ? <FunctionArgs chain={chain} data={safeTx.data} /> : null}
        </div>

        {details}
      </CardBody>
    </Card>
  );
}

export default CallDataDecode;
