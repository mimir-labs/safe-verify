// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Divider, Form, Input, Link } from '@heroui/react';
import { useCallback, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';

import IconFailed from '@mimir-wallet/assets/svg/icon-failed-fill.svg?react';
import IconSuccess from '@mimir-wallet/assets/svg/icon-success-fill.svg?react';
import AddressRow from '@mimir-wallet/components/AddressRow';
import { useMediaQuery } from '@mimir-wallet/hooks/useMediaQuery';
import { useQueryParam } from '@mimir-wallet/hooks/useQueryParams';
import { Operation } from '@mimir-wallet/safe/types';

import CallDataDecode from './CallDataDecode';
import { isValidUrl, type VerifyResult, verifySafeTransaction } from './utils';

function Item({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className='flex justify-between'>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Verify() {
  const [url] = useQueryParam<string>('url');
  const [safeTransactionLink, setSafeTransactionLink] = useState(() => (url ? decodeURIComponent(url) : ''));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult>();
  const [error, setError] = useState<string>();
  const upSm = useMediaQuery('sm');
  const formRef = useRef<HTMLFormElement>(null);

  const handleClick = useCallback(async (link: string) => {
    setLoading(true);

    try {
      const result = await verifySafeTransaction(link);

      setResult(result);
      setError(undefined);
    } catch (error: any) {
      setError(error.message);
    }

    setLoading(false);
  }, []);

  useEffectOnce(() => {
    if (url && isValidUrl(url)) {
      handleClick(url);
    }
  });

  return (
    <Card className='w-[1000px] max-w-[calc(100vw-32px)] sm:max-w-full mx-4 sm:mx-auto my-4 sm:my-5 sm:p-5 p-3 border-1 border-secondary space-y-3 sm:space-y-5'>
      <CardHeader className='flex justify-center p-0'>
        <h4 className='text-center text-xl font-bold'>
          Verify your Safe{'{'}Wallet{'}'} transaction
        </h4>
      </CardHeader>
      <Divider />
      <CardBody className='p-0 space-y-3 sm:space-y-5'>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleClick(safeTransactionLink);
          }}
          ref={formRef}
        >
          <Input
            variant='bordered'
            labelPlacement='outside'
            label='Share Link'
            placeholder='Paste {Safe} share link here, or paste explorer transaction link here'
            value={safeTransactionLink}
            onChange={(e) => {
              setSafeTransactionLink(e.target.value);

              if (isValidUrl(e.target.value)) {
                handleClick(e.target.value);
              }
            }}
          />
          <Divider />
          <Button color='primary' fullWidth disabled={!safeTransactionLink} type='submit' isLoading={loading}>
            Verify
          </Button>
        </Form>
        {error ? (
          <Alert color='danger'>{error}</Alert>
        ) : result ? (
          <>
            <div className='p-3 rounded-small bg-secondary space-y-3 text-small sm:text-medium'>
              <Item
                label='Safe Address'
                value={
                  <AddressRow
                    showFull={upSm}
                    withCopy
                    withExplorer
                    iconSize={18}
                    chain={result.chain}
                    address={result.safeAddress}
                  />
                }
              />
              <Item label='Version' value={result.version} />
              <Item label='SafeHash Check' value={result.hash.verified ? <IconSuccess /> : <IconFailed />} />

              {result.signatures.map((signature, index) => (
                <Item
                  key={signature.signer}
                  label={
                    <div className='flex flex-wrap items-center'>
                      Signature Check {index + 1}
                      <span className='inline-flex items-center gap-x-1'>
                        (Signer:
                        <AddressRow
                          showFull={upSm}
                          withCopy
                          withExplorer
                          iconSize={18}
                          chain={result.chain}
                          address={signature.signer}
                        />
                        )
                      </span>
                    </div>
                  }
                  value={signature.verified ? <IconSuccess /> : <IconFailed />}
                />
              ))}
            </div>

            {result.safeTx.operation === Operation.DelegateCall && (
              <Alert variant='flat' color='danger' title={<h4 className='text-large font-bold uppercase'>Warning</h4>}>
                This operation/transaction may alter the internal state of the multisig contract, Please review the
                details carefully.
              </Alert>
            )}

            <CallDataDecode hash={result.hash.value} safeTx={result.safeTx} chain={result.chain} />
          </>
        ) : null}
      </CardBody>
      <Divider />
      <CardFooter className='p-0'>
        <Link isExternal showAnchorIcon href='https://github.com/mimir-labs/safe-verify'>
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
  );
}

export default Verify;
