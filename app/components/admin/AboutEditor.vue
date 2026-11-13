<template>
  <div class="grid gap-3">
    <UCollapsible
      default-open
      :unmount-on-hide="false"
    >
      <template #default="{ open }">
        <UButton
          block
          color="neutral"
          variant="ghost"
          class="justify-start"
          :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          :label="$t('admin.about.identity')"
        />
      </template>
      <template #content>
        <div class="grid gap-4 px-1 pt-3">
          <UFormField :label="$t('admin.documentTitle')">
            <UInput
              v-model="content.title"
              :placeholder="$t('admin.documentTitle')"
              class="w-full"
            />
          </UFormField>
          <p
            v-if="content.title.trim()"
            class="text-muted text-sm"
          >
            {{ $t('admin.storedTitle', { title: content.title.trim() }) }}
          </p>
          <p
            v-else
            class="text-error text-sm"
          >
            {{ $t('admin.missingTitle') }}
          </p>
          <UFormField :label="$t('admin.fields.description')">
            <UTextarea
              v-model="content.description"
              :rows="3"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
    </UCollapsible>

    <UCollapsible :unmount-on-hide="false">
      <template #default="{ open }">
        <UButton
          block
          color="neutral"
          variant="ghost"
          class="justify-start"
          :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          :label="`${$t('admin.about.skills')} · ${content.skills.length}`"
        />
      </template>
      <template #content>
        <div class="grid gap-4 pt-3">
          <div
            v-for="(group, index) in content.skills"
            :key="index"
            class="border-default grid gap-2 rounded-lg border p-3"
          >
            <div class="flex gap-2">
              <UInput
                v-model="group.category"
                class="flex-1"
                :placeholder="$t('admin.about.group')"
              />
              <AdminIconPicker v-model="group.icon" />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click="content.skills.splice(index, 1)"
              />
            </div>
            <UInputTags
              v-model="group.items"
              class="w-full"
              :placeholder="$t('admin.addItem')"
            />
          </div>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-plus"
            :label="$t('admin.about.addGroup')"
            @click="content.skills.push({ category: '', icon: '', items: [] })"
          />
        </div>
      </template>
    </UCollapsible>

    <UCollapsible :unmount-on-hide="false">
      <template #default="{ open }">
        <UButton
          block
          color="neutral"
          variant="ghost"
          class="justify-start"
          :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          :label="`${$t('admin.about.stack')} · ${content.stack.length}`"
        />
      </template>
      <template #content>
        <div class="grid gap-4 pt-3">
          <div
            v-for="(group, index) in content.stack"
            :key="index"
            class="border-default grid gap-2 rounded-lg border p-3"
          >
            <div class="flex gap-2">
              <UInput
                v-model="group.category"
                class="flex-1"
                :placeholder="$t('admin.about.group')"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click="content.stack.splice(index, 1)"
              />
            </div>
            <div
              v-for="(tech, techIndex) in group.technologies"
              :key="techIndex"
              class="grid items-center gap-2 sm:grid-cols-[1fr_auto_8rem_auto]"
            >
              <UInput
                v-model="tech.name"
                :placeholder="$t('admin.fields.title')"
              />
              <AdminIconPicker
                v-model="tech.iconName"
                prefer="icon"
              />
              <UInput
                v-model="tech.level"
                :placeholder="$t('admin.about.level')"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                @click="group.technologies.splice(techIndex, 1)"
              />
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-plus"
              :label="$t('admin.about.addTech')"
              @click="group.technologies.push({ name: '', iconName: '', level: '' })"
            />
          </div>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-plus"
            :label="$t('admin.about.addGroup')"
            @click="content.stack.push({ category: '', technologies: [] })"
          />
        </div>
      </template>
    </UCollapsible>

    <UCollapsible :unmount-on-hide="false">
      <template #default="{ open }">
        <UButton
          block
          color="neutral"
          variant="ghost"
          class="justify-start"
          :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          :label="`${$t('admin.about.passions')} · ${content.passions.length}`"
        />
      </template>
      <template #content>
        <div class="grid gap-3 pt-3">
          <div
            v-for="(passion, index) in content.passions"
            :key="index"
            class="border-default grid gap-2 rounded-lg border p-3"
          >
            <div class="flex gap-2">
              <AdminIconPicker v-model="passion.icon" />
              <UInput
                v-model="passion.title"
                class="flex-1"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click="content.passions.splice(index, 1)"
              />
            </div>
            <UTextarea
              v-model="passion.description"
              :rows="2"
            />
          </div>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-plus"
            :label="$t('admin.about.addPassion')"
            @click="content.passions.push({ title: '', icon: '', description: '' })"
          />
        </div>
      </template>
    </UCollapsible>

    <UCollapsible :unmount-on-hide="false">
      <template #default="{ open }">
        <UButton
          block
          color="neutral"
          variant="ghost"
          class="justify-start"
          :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          :label="`${$t('admin.about.enterprise')} · ${content.services.length}`"
        />
      </template>
      <template #content>
        <div class="grid gap-3 pt-3">
          <UFormField label="Mission">
            <UTextarea
              v-model="content.mission"
              :rows="3"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Vision">
            <UTextarea
              v-model="content.vision"
              :rows="3"
              class="w-full"
            />
          </UFormField>
          <div
            v-for="(service, index) in content.services"
            :key="index"
            class="border-default grid gap-2 rounded-lg border p-3"
          >
            <div class="flex gap-2">
              <AdminIconPicker v-model="service.icon" />
              <UInput
                v-model="service.name"
                class="flex-1"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click="content.services.splice(index, 1)"
              />
            </div>
            <UTextarea
              v-model="service.description"
              :rows="2"
            />
          </div>
        </div>
      </template>
    </UCollapsible>

    <p class="text-muted text-sm">
      {{ $t('admin.about.experiences') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AboutContent } from '~~/shared/admin/about-document'

const content = defineModel<AboutContent>({ required: true })
</script>
