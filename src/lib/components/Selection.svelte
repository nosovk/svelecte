<script>
  import { flip } from 'svelte/animate';

  export let /** @type array */     selectedOptions;
  export let /** @type boolean */   multiple;
  export let /** @type function */  collapseSelection;
  export let /** @type boolean */   hasFocus;
  export let /** @type boolean */   alwaysCollapsed;
  export let /** @type string */    inputValue;
  export let /** @type string */    currentValueField;
  export let itemComponent;
  export let renderer;
  
  let doCollapse = true;
  let flipDurationMs = 100;

  // TODO: test
  hasFocus.subscribe(value => {
    !alwaysCollapsed && setTimeout(() => {
      doCollapse = !value;
    });
  });
</script>

{#if selectedOptions.length }
  {#if multiple && collapseSelection && doCollapse}
    {@html collapseSelection(selectedOptions.length, selectedOptions) }
  {:else}
    {#each selectedOptions as opt (opt[currentValueField])}
    <div class="sv-flex-ellipsis" animate:flip={{duration: flipDurationMs }}>
      <svelte:component this={itemComponent} formatter={renderer} item={opt} isSelected={true}
        isMultiple={multiple} inputValue={$inputValue}
        on:deselect
      />
    </div>
    {/each}
  {/if}
{/if}

<style>
  .sv-flex-ellipsis {
    display: flex;
    min-width: 0;
  }
</style>