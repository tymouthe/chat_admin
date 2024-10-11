<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center mb-8">
      <div class="flex space-x-4">
        <button
          v-if="showForm"
          @click="showForm = false"
          class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition ease-in-out duration-200 transform hover:scale-105 focus:ring focus:ring-offset-2 focus:ring-gray-500"
          aria-label="Back"
        >
          Back
        </button>
        <button
          v-if="!showForm"
          @click="showForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition ease-in-out duration-200 transform hover:scale-105 focus:ring focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Add agent"
        >
          + Create New
        </button>
      </div>
    </div>

    <!-- Create Users Form -->
    <CreateUsers 
      v-if="showForm" 
      :formData="formData" 
      :collectionName="'agent'" 
      @onSubmit="fetchAgents" 
    />

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>

    <!-- Agent Table -->
    <div v-if="!isLoading && !showForm" class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Username</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Password</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Lottery Type</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Phone Number</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(agent, index) in agents" :key="agent.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ agent.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ agent.username }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ agent.password }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ agent.lotteryType }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ agent.phoneNumber }}</td>
            <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
              <UpdateEntity 
                :entityData="agent" 
                :collectionName="'agent'" 
                :entityName="'Agent'" 
                @onUpdate="fetchAgents" 
                v-slot="{ update }">
                <button @click="update" class="text-blue-600 hover:text-blue-800 focus:outline-none">
                  <i class="fas fa-edit"></i> <!-- Edit Icon -->
                </button>
              </UpdateEntity>
              <DeleteEntity 
                :entityId="agent.id" 
                :collectionName="'agent'" 
                @onDelete="fetchAgents" 
                v-slot="{ delete: deleteEntity }">
                <button @click="deleteEntity" class="text-red-600 hover:text-red-800 focus:outline-none">
                  <i class="fas fa-trash"></i> <!-- Trash Icon -->
                </button>
              </DeleteEntity>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { collection, onSnapshot } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { db } from '~/firebase/firebase';
import CreateUsers from './create/CreateUsers.vue';
import DeleteEntity from './delete/DeleteEntity.vue'; // Import your DeleteEntity component
import UpdateEntity from './update/UpdateEntity.vue'; // Import your UpdateEntity component

// State to manage visibility of the form, the list of agents, and loading indicator
const showForm = ref(false);
const agents = ref([]);
const formData = ref({
  name: '',
  username: '',
  password: '',
  lotteryType: '',
  phoneNumber: ''
});
const isLoading = ref(true); // Loading state

// Function to fetch agents from Firestore in real-time
const fetchAgents = () => {
  try {
    isLoading.value = true; // Set loading to true before fetching data
    // Set up a real-time listener for changes in the 'agent' collection
    onSnapshot(collection(db, 'agent'), (snapshot) => {
      agents.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Realtime Fetched Agents:', agents.value); // Log the fetched data
      isLoading.value = false; // Stop loading once data is fetched
    });
  } catch (error) {
    console.error('Error fetching agents: ', error);
    isLoading.value = false; // Stop loading if there's an error
  }
};

// Fetch agents when the component is mounted
onMounted(fetchAgents);
</script>

<style scoped>
.container {
  max-width: 100%; /* Set to full screen width */
  height: auto; /* Set height to auto */
}
</style>
