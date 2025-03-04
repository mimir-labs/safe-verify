// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address, Chain, Hex } from 'viem';

import { Card, CardBody, CardHeader, Divider } from '@heroui/react';

import AddressRow from '@mimir-wallet/components/AddressRow';
import Bytes from '@mimir-wallet/components/Bytes';
import Calldisplay from '@mimir-wallet/components/Calldisplay';
import FormatBalance from '@mimir-wallet/components/FormatBalance';
import { useMediaQuery } from '@mimir-wallet/hooks/useMediaQuery';
import { Operation, type SafeTransaction } from '@mimir-wallet/safe/types';

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

function CallDataDecode({
  hash,
  safeAddress,
  safeTx,
  chain
}: {
  hash: Hex;
  safeAddress: Address;
  safeTx: SafeTransaction;
  chain: Chain;
}) {
  const upSm = useMediaQuery('sm');

  const details = (
    <div className='bg-secondary rounded-small p-2.5 space-y-1'>
      <Item label='Hash' content={hash} />
      <Item
        label='To'
        content={<AddressRow showFull={upSm} withCopy withExplorer iconSize={18} chain={chain} address={safeTx.to} />}
      />
      <Item label='Value' content={<FormatBalance value={safeTx.value} showSymbol {...chain.nativeCurrency} />} />
      <Item label='Operation' content={Operation[safeTx.operation]} />
      <Item label='safeTxGas' content={<FormatBalance value={safeTx.safeTxGas} showSymbol={false} />} />
      <Item label='baseGas' content={<FormatBalance value={safeTx.baseGas} showSymbol={false} />} />
      <Item
        label='refundReceiver'
        content={
          <AddressRow
            showFull={upSm}
            withCopy
            withExplorer
            iconSize={18}
            chain={chain}
            address={safeTx.refundReceiver}
          />
        }
      />
      <Item label='Raw Data' content={<Bytes data={safeTx.data} />} />
    </div>
  );

  return (
    <Card className='p-3 sm:p-5 border-1 border-secondary space-y-3 sm:space-y-5'>
      <CardHeader className='p-0'>
        <h4 className='text-center text-xl font-bold'>Call Data Decode</h4>
      </CardHeader>
      <Divider />
      <CardBody className='p-0 space-y-3 sm:space-y-5'>
        <Calldisplay
          chain={chain}
          data={safeTx.data}
          from={safeAddress}
          operation={safeTx.operation}
          to={safeTx.to}
          value={safeTx.value}
        />

        {details}
      </CardBody>
    </Card>
  );
}

export default CallDataDecode;
