// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain, Hex } from 'viem';

import { Button, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { createContext, useContext, useState } from 'react';
import { useToggle } from 'react-use';

import AddressRow from '@mimir-wallet/components/AddressRow';
import Bytes from '@mimir-wallet/components/Bytes';
import DecodeCallData from '@mimir-wallet/components/DecodeCallData';
import FormatBalance from '@mimir-wallet/components/FormatBalance';
import FunctionArgs from '@mimir-wallet/components/FunctionArgs';
import { useMediaQuery } from '@mimir-wallet/hooks/useMediaQuery';
import { useParseCall } from '@mimir-wallet/hooks/useParseCall';
import { Operation, type SafeTransaction } from '@mimir-wallet/safe/types';

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

function CallDataDecode({ hash, safeTx, chain }: { hash: Hex; safeTx: SafeTransaction; chain: Chain }) {
  const [dataSize, parsed, isParsed] = useParseCall(safeTx.data);
  const upSm = useMediaQuery('sm');
  const [decodeSuccess, setDecodeSuccess] = useState(false);

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
        <context.Provider value={{ decodeSuccess, setDecodeSuccess }}>
          <div
            data-success={decodeSuccess}
            className='p-0 rounded-medium bg-transparent space-y-4 data-[success=true]:bg-success/50 data-[success=true]:p-3 transition-all duration-300'
          >
            {dataSize > 0 ? (
              <div className='flex flex-wrap items-center gap-2 text-medium'>
                {safeTx.operation === Operation.DelegateCall ? (
                  <b className='text-danger'>⚠️ DelegateCall</b>
                ) : (
                  <b className='text-primary'>Call</b>
                )}
                <span>{parsed.functionName}</span>
                <b>On</b>
                <AddressRow withCopy showFull={upSm} withExplorer address={safeTx.to} iconSize={20} chain={chain} />
              </div>
            ) : null}

            {safeTx.value > 0n ? (
              <div className='flex flex-wrap items-center gap-2 text-medium'>
                <b className='text-primary'>Send</b>
                <FormatBalance value={safeTx.value} showSymbol {...chain.nativeCurrency} />
                <b>To</b>
                <AddressRow withCopy showFull={upSm} withExplorer address={safeTx.to} iconSize={20} chain={chain} />
              </div>
            ) : null}

            {dataSize > 0 ? (
              isParsed ? (
                <FunctionArgs chain={chain} data={safeTx.data} />
              ) : (
                <Fallback data={safeTx.data} />
              )
            ) : null}
          </div>

          {details}
        </context.Provider>
      </CardBody>
    </Card>
  );
}

export default CallDataDecode;
