// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hex } from 'viem';

import { Autocomplete, AutocompleteItem } from '@heroui/react';
import React, { useMemo, useState } from 'react';
import * as viemChains from 'viem/chains';

import Calldisplay from '@mimir-wallet/components/Calldisplay';
import ChainIcon from '@mimir-wallet/components/ChainIcon';
import { type ChainInfo, useAllChains } from '@mimir-wallet/hooks/useChains';

type FieldState = {
  selectedKey: string | number | null;
  inputValue: string;
};

function CallDataOnly({ calldata }: { calldata: Hex }) {
  const chains = useAllChains();
  // Store Autocomplete input value, selected option, open state, and items
  // in a state tracker
  const [fieldState, setFieldState] = useState<FieldState>({
    selectedKey: 1,
    inputValue: 'Ethereum Mainnet'
  });

  // Specify how each of the Autocomplete values should change when an
  // option is selected from the list box
  const onSelectionChange = (key: string | number | null) => {
    setFieldState(() => {
      const selectedItem = chains?.find((option) => option.chainId === Number(key));

      return {
        inputValue: selectedItem?.name || '',
        selectedKey: key
      };
    });
  };

  // Specify how each of the Autocomplete values should change when the input
  // field is altered by the user
  const onInputChange = (value: string) => {
    setFieldState((prevState) => ({
      inputValue: value || '',
      selectedKey: prevState.selectedKey
    }));
  };

  const selectChain = useMemo(
    () => Object.values(viemChains).find((chain) => chain.id === Number(fieldState.selectedKey)) || viemChains.mainnet,
    [fieldState.selectedKey]
  );

  const filteredChains = useMemo(
    () =>
      (chains || []).filter((chain) =>
        Number(fieldState.inputValue)
          ? chain.chainId === Number(fieldState.inputValue)
          : chain.name.toLowerCase().includes(fieldState.inputValue.toLowerCase())
      ),
    [chains, fieldState.inputValue]
  );

  return (
    <>
      <div className='p-1'>
        <Autocomplete<ChainInfo>
          inputValue={fieldState.inputValue}
          menuTrigger='focus'
          items={filteredChains}
          label='I want to send it to:'
          placeholder='Search a chain'
          variant='bordered'
          description='select the chain where the call data is located'
          labelPlacement='outside'
          itemHeight={48}
          selectedKey={fieldState.selectedKey}
          onInputChange={onInputChange}
          onSelectionChange={onSelectionChange}
          onOpenChange={(isOpen) => {
            if (isOpen) {
              setFieldState((prevState) => ({
                inputValue: '',
                selectedKey: prevState.selectedKey
              }));
            }
          }}
        >
          {(chain) => (
            <AutocompleteItem key={chain.chainId} textValue={chain.name}>
              <div className='flex gap-2 items-center'>
                <ChainIcon icon={chain.icon} />
                <div className='flex flex-col'>
                  <p>{chain.name}</p>
                  <p>Chain ID: {chain.chainId}</p>
                </div>
              </div>
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <Calldisplay chain={selectChain} data={calldata} />
    </>
  );
}

export default React.memo(CallDataOnly);
