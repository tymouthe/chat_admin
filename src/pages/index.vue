<!-- Layout.vue -->
<template>
  <div class="grid">
    <nav class="bg-blue-900 p-4 flex justify-between items-center shadow-md">
      <div class="text-white font-bold text-lg">{{ username }} ({{ userRole }})</div>
      <div>
        <a href="#" @click="logout" class="text-white font-bold text-lg">Logout</a>
      </div>
    </nav>

    <div class="p-4">
      <nav class="bg-white p-4 rounded-lg shadow-lg">
        <ul class="flex space-x-8">
          <li v-if="userRole === 'superadmin'">
            <a
              href="#"
              @click.prevent="currentView = 'Dashboard'"
              :class="currentView === 'Dashboard' ? activeClass : inactiveClass"
              class="flex items-center rounded-md p-3 transition duration-200 font-semibold"
            >
              <i class="fas fa-tachometer-alt"></i>
              <span class="ml-2">Dashboard</span>
            </a>
          </li>
          <li v-for="item in visibleNavItems" :key="item.view">
            <a
              href="#"
              @click.prevent="currentView = item.view"
              :class="currentView === item.view ? activeClass : inactiveClass"
              class="flex items-center rounded-md p-3 transition duration-200 font-semibold"
            >
              <i :class="item.icon"></i>
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="p-4">
      <component :is="currentViewComponent" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import Agent from '~/components/Agent.vue';
import Dashboard from '~/components/Dashboard.vue';
import Master from '~/components/Master.vue';
import Member from '~/components/Member.vue';
import Senior from '~/components/Senior.vue';
import SuperSenior from '~/components/SuperSenior.vue';

const router = useRouter();
const currentView = ref('');
const username = ref('');
const userRole = ref('');

const roleHierarchy = {
  superadmin: ['SuperSenior', 'Senior', 'Master', 'Agent', 'Member'],
  supersenior: ['Senior', 'Master', 'Agent', 'Member'],
  senior: ['Master', 'Agent', 'Member'],
  master: ['Agent', 'Member'],
  agent: ['Member'],
};

const allNavItems = [
  { view: 'SuperSenior', label: 'SuperSenior', icon: 'fas fa-user-shield' },
  { view: 'Senior', label: 'Senior', icon: 'fas fa-user-tie' },
  { view: 'Master', label: 'Master', icon: 'fas fa-user-ninja' },
  { view: 'Agent', label: 'Agent', icon: 'fas fa-user-circle' },
  { view: 'Member', label: 'Member', icon: 'fas fa-users' }
];

const visibleNavItems = computed(() => {
  return allNavItems.filter(item => roleHierarchy[userRole.value]?.includes(item.view));
});

const viewComponents = {
  Dashboard,
  SuperSenior,
  Senior,
  Master,
  Agent,
  Member
};

const currentViewComponent = computed(() => viewComponents[currentView.value]);

const activeClass = 'text-blue-600 bg-blue-200';
const inactiveClass = 'text-gray-700 hover:bg-gray-200';

const fetchUserData = async () => {
  userRole.value = localStorage.getItem('role') || '';
  username.value = localStorage.getItem('username') || '';
};

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  router.push('/login');
};

onMounted(() => {
  fetchUserData();
  if (userRole.value === 'superadmin') {
    currentView.value = 'Dashboard';
  } else if (visibleNavItems.value.length > 0) {
    currentView.value = visibleNavItems.value[0].view;
  }
});

watch(userRole, (newRole) => {
  if (newRole === 'superadmin') {
    currentView.value = 'Dashboard';
  } else if (visibleNavItems.value.length > 0 && !roleHierarchy[newRole]?.includes(currentView.value)) {
    currentView.value = visibleNavItems.value[0].view;
  }
});
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>