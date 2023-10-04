<script>
  export let options = [];
  export let _selection = [];

  let selectedOptions = _selection;
  let availableItems = [];
  let hasDropdownOpened = false;
  let multiple = true;

  let theme = 'svelecte-control';
</script>

<div class="svelecte" class:svelecte-control={theme === 'svelecte-control'}>
  <!-- main component -->
  <div class="sv-control">
    <!-- 📌 icon -->
    <div class="sv-input-wrap" class:has-multiple={multiple}>
      {#each selectedOptions as opt}
      <div class="sv-selection sv-item">
        <div class="sv-item-content">{opt.text}</div>
        <button class="sv-btn is-item-btn" data-action="deselect" type="button" tabindex="-1">
          <svg class="indicator-icon" height="16" width="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
        </button>
      </div>
      {/each}
      <input type="text" id="inputId"  class="sv-input"
        role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="dropdown-list"
        style={`${selectedOptions.length ? 'width: 40px' : ''}`}
        placeholder={selectedOptions.length ? '' : 'Select'}>
      <!-- selection (single|multi) -->
      <!-- input -->      
    </div>
    <div class="sv-buttons">
      <!-- CLEAR SELECTION -->
      <button type="button" class="sv-btn is-indicator" aria-hidden="true" tabindex="-1">
        <!-- (📌) clear icon -->
        <svg class="indicator-icon" height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
      </button>
      <!-- separator -->
      <div class="sv-btn-separator"></div>
      <!-- DROPDOWN TOGGLE -->
      <button type="button" class="sv-btn is-indicator" aria-hidden="true" tabindex="-1">
        <!-- (📌) dropdown toggle -->
        <svg width="20" height="20" class="indicator-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
      </button>
      <!-- 📌 control-end -->
    </div>
  </div>

  <!-- dropdown -->
  <div class="sv-dropdown" class:is-open={hasDropdownOpened}> <!-- wrapper (container) -->
    <div class="sv-dropdown-scroll">  <!-- scroll container -->
      <div id="dropdown-list" role="listbox" aria-label="List" class="sv-dropdown-content">
        {#each options as opt}
        <div class="sv-item">
          <div class="sv-item-content">
            {opt.text}
          </div>
        </div>
        {/each}
      </div>
      <!-- options: list | virtual list -->
      <!-- creatable row -->
      
      <!-- 📌✨ NEW slot -->
    </div>
  </div>

  <!-- native select -->
  <select id="selectId" name="name" class="sv-invisible-element" tabindex="-1" required aria-hidden="true">
    {#each selectedOptions as opt}
    <!-- <option value="" selected>ABCDE</option> -->
    {/each}
  </select>
</div>

<style>
  .svelecte {
    --sv-border: var(--sv-border-width, 1px) var(--sv-border-style, solid) var(--sv-border-color, #ccc);
    position: relative;
    flex: 1 1 auto;
    color: var(--sv-color, inherit);
    --sv-general-padding: 4px;  /* theme */
    --sv-input-wrap-padding: var(--sv-general-padding);
    --sv-item-padding: var(--sv-general-padding);
    --sv-dropdown-offset: 1px;
  }
  .svelecte-theme {
    /* TODO: all specific stylings move here */
  }

  /* control */
  .sv-control, .sv-input-wrap, .sv-selection {
    display: flex;
  }
  
  .sv-control {
    display: flex;
    align-items: center;
    border: var(--sv-border);
    border-radius: var(--sv-border-radius, 4px);
    min-height: var(--sv-min-height, 30px);
  }
  .sv-control:focus-within {
    outline: 3px solid #9ebffd;
    border-color: transparent;
  }

  /** ************************************ items & selected */

  .sv-input-wrap {
    flex: 1;
    flex-wrap: wrap;
    gap: 4px;
    padding: var(--sv-input-wrap-padding);
    padding-left: calc(var(--sv-input-wrap-padding));
  }
  .sv-input-wrap.has-multiple .sv-item {
    background-color: var(--sv-item-bg-color, #efefef);
  }
  .sv-input-wrap .sv-item-content {
    padding: var(--sv-item-padding, var(--sv-general-padding));
  }
  .is-item-btn {
    align-items: center;
    margin-left: calc(var(--sv-item-padding) / -2);
  }
  .is-item-btn:hover {
    background-color: var(--sv-item-btn-bg, #ccc);
  }

  /** ************************************ input */

  .sv-input {
    box-sizing: content-box;
    width: 19px;
    background: rgba(0, 0, 0, 0) none repeat scroll 0px center;
    border: 0px none;
    font-size: inherit;
    font-family: inherit;
    opacity: 1;
    outline: currentcolor none 0px;
    padding: 0px;
    color: inherit;
    align-self: center;
  }

  /** ************************************ buttons */

  .sv-buttons {
    display: flex;
    align-self: stretch;
    margin: var(--sv-general-padding, 4px);
  }
  .sv-btn {
    color: var(--sv-icon-color, #bbb);
    display: flex;
    transition: color 150ms ease 0s;
    box-sizing: border-box;
    background-color: var(--sv-icon-bg-color, transparent);
    border-width: var(--sv-icon-border-width, 0);
  }
  .sv-btn:hover {
    color: var(--sv-icon-color-hover, #777);
  }
  .sv-btn.is-indicator {
    align-items: center;
    fill: currentcolor;
    line-height: 1;
    stroke: currentcolor;
    stroke-width: 0px;
  }
  .sv-btn-separator {
    align-self: stretch;
    background-color: var(--sv-border-color, #ccc);
    margin-bottom: 2px;
    margin-top: 2px;
    width: 1px;
    box-sizing: border-box;
  }

  /** ************************************ dropdown */

  .sv-dropdown {
    margin: var(--sv-dropdown-offset, 0) 0;
    box-sizing: border-box;
    position: absolute;
    min-width: 100%;
    display: none;
    background-color: var(--sv-bg, #fff);
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: var(--sv-border-radius, 4px);
    box-shadow: var(--sv-dropdown-shadow, 0 6px 12px #0000002d);
    z-index: 2;
  }

  .sv-dropdown-content {
    padding: var(--sv-general-padding);
  }
  .sv-dropdown-content .sv-item {
    padding-left: var(--sv-dropdown-item-padding, 6px);
  }
  .sv-dropdown-content .sv-item:hover {
    background-color: #F2F5F8;
  }
  
  .optgroup-header {
    padding: 3px 3px 3px 6px;
    font-weight: bold;
  }

  .sv-invisible-element {
    position: absolute;
    opacity: 0;
    z-index: -2;
    inset: 0 0 0 0;
  }
</style>