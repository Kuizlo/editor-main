<template>
  <toolbar-scrollable ref="scrollableRef" class="umo-scrollable-container">
    <div class="umo-classic-menu">
      <div v-if="menus.length > 1" class="umo-virtual-group">
        <t-select
          v-if="selectVisible"
          v-model="currentMenu"
          :popup-props="{
            destroyOnClose: true,
            attach: container,
          }"
          size="small"
          auto-width
          borderless
          @change="toggoleMenu"
        >
          <template #prefixIcon>
            <icon name="menu" />
          </template>
          <t-option
            v-for="item in menus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </t-select>
      </div>
      <template v-if="currentMenu === 'base'">
        <div class="umo-virtual-group">
          <menus-toolbar-base-undo />
          <menus-toolbar-base-redo />
          <menus-toolbar-base-format-painter />
          <menus-toolbar-base-clear-format />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-base-heading />
          <menus-toolbar-base-font-family borderless />
          <menus-toolbar-base-font-size borderless />
          <menus-toolbar-base-bold />
          <menus-toolbar-base-italic />
          <menus-toolbar-base-underline />
          <menus-toolbar-base-strike />
          <menus-toolbar-base-subscript />
          <menus-toolbar-base-superscript />
          <menus-toolbar-base-color />
          <menus-toolbar-base-background-color />
          <menus-toolbar-base-highlight v-if="!disableItem('highlight')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-base-ordered-list
            v-if="!disableItem('ordered-list')"
          />
          <menus-toolbar-base-bullet-list v-if="!disableItem('bullet-list')" />
          <menus-toolbar-base-task-list v-if="!disableItem('task-list')" />
          <menus-toolbar-base-indent />
          <menus-toolbar-base-outdent />
          <menus-toolbar-base-line-height v-if="!disableItem('line-height')" />
          <menus-toolbar-base-margin v-if="!disableItem('margin')" />
          <menus-toolbar-base-align-dropdown />
          <menus-toolbar-base-quote v-if="!disableItem('quote')" />
          <menus-toolbar-base-code v-if="!disableItem('code')" />
          <menus-toolbar-base-select-all v-if="!disableItem('select-all')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-base-import-word />
          <menus-toolbar-base-markdown v-if="!disableItem('markdown')" />
          <menus-toolbar-base-search-replace />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-base-print v-if="!disableItem('print')" />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_base" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'insert'">
        <div class="umo-virtual-group">
          <menus-toolbar-insert-link v-if="!disableItem('link')" />
          <menus-toolbar-insert-image v-if="!disableItem('image')" />
          <menus-toolbar-insert-video v-if="!disableItem('video')" />
          <menus-toolbar-insert-audio v-if="!disableItem('audio')" />
          <menus-toolbar-insert-file v-if="!disableItem('file')" />
          <menus-toolbar-insert-code-block v-if="!disableItem('code-block')" />
          <menus-toolbar-insert-symbol v-if="!disableItem('symbol')" />
          <menus-toolbar-insert-chinese-date
            v-if="!disableItem('chineseDate')"
          />
          <menus-toolbar-insert-emoji v-if="!disableItem('emoji')" />
          <menus-toolbar-insert-math v-if="!disableItem('math')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-insert-columns v-if="!disableItem('columns')" />
          <menus-toolbar-insert-tag v-if="!disableItem('tag')" />
          <menus-toolbar-insert-callout v-if="!disableItem('callout')" />
          <menus-toolbar-insert-mention v-if="!disableItem('mention')" />
          <menus-toolbar-insert-bookmark v-if="!disableItem('bookmark')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-insert-hard-break v-if="!disableItem('hard-break')" />
          <menus-toolbar-insert-hr v-if="!disableItem('hr')" />
          <menus-toolbar-insert-toc v-if="!disableItem('toc')" />
          <menus-toolbar-insert-text-box v-if="!disableItem('textBox')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-insert-template v-if="!disableItem('template')" />
          <menus-toolbar-insert-web-page v-if="!disableItem('webPage')" />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_insert" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'table'">
        <div class="umo-virtual-group">
          <menus-toolbar-table-insert />
          <menus-toolbar-table-fix />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-cells-align />
          <menus-toolbar-table-cells-background />
          <!-- <menus-toolbar-table-border-color /> -->
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-add-row-before :huge="false" />
          <menus-toolbar-table-add-row-after :huge="false" />
          <menus-toolbar-table-add-column-before :huge="false" />
          <menus-toolbar-table-add-column-after :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-delete-row :huge="false" />
          <menus-toolbar-table-delete-column :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-merge-cells :huge="false" />
          <menus-toolbar-table-split-cell :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-toggle-header-row :huge="false" />
          <menus-toolbar-table-toggle-header-column :huge="false" />
          <menus-toolbar-table-toggle-header-cell :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-next-cell :huge="false" />
          <menus-toolbar-table-previous-cell :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-delete />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_table" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'tools'">
        <div class="umo-virtual-group">
          <menus-toolbar-tools-qrcode v-if="!disableItem('qrcode')" />
          <menus-toolbar-tools-barcode v-if="!disableItem('barcode')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-tools-signature v-if="!disableItem('signature')" />
          <menus-toolbar-tools-seal v-if="!disableItem('seal')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-tools-diagrams v-if="!disableItem('diagrams')" />
          <menus-toolbar-tools-echarts v-if="!disableItem('echarts')" />
          <!-- <menus-toolbar-tools-mind-map v-if="!disableItem('mind-map')" /> -->
          <menus-toolbar-tools-mermaid v-if="!disableItem('mermaid')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-tools-chinese-case
            v-if="!disableItem('chineseCase')"
          />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_tools" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'page'">
        <div class="umo-virtual-group">
          <menus-toolbar-page-toggle-toc />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-page-margin />
          <menus-toolbar-page-size />
          <menus-toolbar-page-orientation />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-page-break />
          <menus-toolbar-page-break-marks />
          <menus-toolbar-page-line-number />
          <menus-toolbar-page-watermark v-if="!disableItem('watermark')" />
          <menus-toolbar-page-background v-if="!disableItem('background')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-page-preview v-if="!disableItem('preview')" />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_page" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'export'">
        <div class="umo-virtual-group">
          <menus-toolbar-export-image v-if="!disableItem('exportImage')" />
          <menus-toolbar-export-pdf v-if="!disableItem('exportPDF')" />
          <menus-toolbar-export-text v-if="!disableItem('exportText')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-export-share v-if="!disableItem('share')" />
          <menus-toolbar-export-embed v-if="!disableItem('embed')" />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_export" toolbar-mode="classic" />
        </div>
      </template>
    </div>
  </toolbar-scrollable>
</template>

<script setup lang="ts">
import { withSuppress } from '@/utils/functional'
import { inject, watch, nextTick, ref } from 'vue'
import { useSelect } from '@/composables/select'

const props = defineProps<{
  menus: {
    value: string
    label: string
  }[]
  currentMenu: string
}>()

const { selectVisible } = useSelect()

const emits = defineEmits(['menu-change'])

const container = inject('container')
const options = inject('options')
const disableItem = (name: string) => {
  return options.value.toolbar?.disableMenuItems.includes(name)
}

const currentMenu = ref('')
watch(
  () => props.currentMenu,
  withSuppress(async (val) => {
    currentMenu.value = val
    await nextTick()
    scrollableRef.value?.update()
  }),
  { immediate: true },
)
const scrollableRef = ref<{ update: () => void }>()
const toggoleMenu = async (menu: string) => {
  emits('menu-change', menu)
  await nextTick()
  scrollableRef.value?.update()
}
</script>

<style lang="less" scoped>
.umo-scrollable-container {
  padding: 10px;
}
.umo-classic-menu {
  display: flex;
  align-items: center;
  flex: 1;
  .umo-virtual-group {
    display: flex;
    align-items: center;
    &:empty {
      display: none;
    }
    &:not(:last-child),
    &.is-slot {
      &::before {
        content: '';
        display: block;
        height: 18px;
        width: 1px;
        background-color: var(--umo-border-color-light);
        margin: 0 10px;
      }
    }
    &:first-child::before {
      display: none;
    }
    :deep(.umo-menu-button .umo-button--shape-square) {
      .umo-icon {
        font-size: 14px;
      }
    }
    &-row {
      display: flex;
    }
  }
}
</style>
