// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hex } from 'viem';
import type { ParsedCall } from '@mimir-wallet/hooks/types';
import type { MetaTransaction } from '@mimir-wallet/safe/types';

import React from 'react';

import Bytes from '@mimir-wallet/components/Bytes';
import FormatBalance from '@mimir-wallet/components/FormatBalance';

function CallDetails({ parsed, multisend }: { parsed: ParsedCall; multisend?: MetaTransaction[] | null }) {
  if (parsed.functionName === 'addOwnerWithThreshold') {
    return <span className='inline-flex gap-1' />;
  }

  if (parsed.functionName === 'changeThreshold') {
    const { args } = parsed as ParsedCall<'changeThreshold'>;

    return args[0]?.toString();
  }

  if (parsed.functionName === 'swapOwner') {
    return <span className='inline-flex gap-1' />;
  }

  if (parsed.functionName === 'removeOwner') {
    return <span className='inline-flex gap-1' />;
  }

  // TODO: token icon and address
  if (parsed.functionName === 'transferToken') {
    const { args } = parsed as ParsedCall<'transferToken'>;

    return <FormatBalance value={args[2] as bigint} />;
  }

  // TODO: token icon and address
  if (parsed.functionName === 'transfer') {
    const { args } = parsed as ParsedCall<'transfer'>;

    return <FormatBalance value={args[1] as bigint} />;
  }

  if (parsed.functionName === 'multiSend') {
    const { args } = parsed as ParsedCall<'multiSend'>;

    return multisend ? `${multisend.length} transactions` : <Bytes data={args[0] as Hex} />;
  }

  return '';
}

export default React.memo(CallDetails);
