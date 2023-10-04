<script>
  import { createEventDispatcher } from "svelte";

  import { highlightSearch } from "$lib/lib/utils";
  export let inputValue;  // value only
  
  export let item = null;
  export let isSelected = false;
  export let isDisabled = false;
  export let isMultiple = false;

  export let formatter = null;
  export let disableHighlight = false;

  const dispatch = createEventDispatcher();

  function onClick(e) {
    dispatch('deselect', item);
  }
  
</script>

<div class="sv-item" class:is-multiple={isMultiple}  class:is-disabled={isDisabled} class:is-selected={isSelected}>
  <!-- TODO: extract sv-item-content from formatter/highlightSearch functions -->
  {@html (isSelected 
    ? `<div class="sv-item-content">${formatter(item, isSelected, inputValue)}</div>`
    : highlightSearch(item, isSelected, inputValue, formatter, disableHighlight))
  }
  {#if isSelected && isMultiple}
  <button class="sv-item-btn" tabindex="-1" data-action="deselect" type="button" on:click={onClick} on:mousedown|preventDefault|stopPropagation>
    <svg height="16" width="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
  </button>
  {/if}
</div>

<style>
  .sv-item {
    line-height: 1;
  }
  .sv-item.is-multiple {
    background-color: var(--sv-item-bg-color, #efefef);
  }
  .is-selected :global(.sv-item-content) {
    padding: var(--sv-item-padding, var(--sv-general-padding));
  }
  .sv-item-btn {
    box-sizing: border-box;
    border-width: 0;
    display: flex;
    align-items: center;
    margin-left: calc(var(--sv-item-padding) / -2);
    padding: var(--sv-item-close-padding, 3px);
  }
  .sv-item-btn:hover {
    background-color: var(--sv-item-btn-bg, #ccc);
  }
</style>