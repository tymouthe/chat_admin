<template>
  <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-center">
    <div
      v-if="alertVisible"
      class="fixed top-4 right-4 w-80 bg-green-500 text-white p-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out"
      :class="{'translate-y-0': alertVisible, 'translate-y-[-100px]': !alertVisible}"
      @click="alertVisible = false"
    >
      Account created successfully for {{ alertName }}!
    </div>

    <form @submit.prevent="CreateUsers" novalidate class="max-w-2xl mx-auto space-y-4 w-full">
      <!-- Name field -->
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <label class="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4" for="name">
            Name <span class="text-red-500">*</span>
          </label>
          <div class="w-2/3">
            <input
              v-model="formData.name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
              id="name"
              type="text"
              placeholder="Enter name"
              required
            />
            <div v-if="validationErrors.name" class="text-red-500 text-sm mt-1">
              {{ validationErrors.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Username field -->
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <label class="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4" for="username">
            Username <span class="text-red-500">*</span>
          </label>
          <div class="w-2/3">
            <input
              v-model="formData.username"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
              id="username"
              type="text"
              placeholder="Enter username"
              required
            />
            <div v-if="validationErrors.username" class="text-red-500 text-sm mt-1">
              {{ validationErrors.username }}
            </div>
          </div>
        </div>
      </div>

      <!-- Password field -->
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <label class="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4" for="password">
            Password <span class="text-red-500">*</span>
          </label>
          <div class="w-2/3">
            <input
              v-model="formData.password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
              id="password"
              type="password"
              placeholder="Enter password"
              required
            />
            <div v-if="validationErrors.password" class="text-red-500 text-sm mt-1">
              {{ validationErrors.password }}
            </div>
          </div>
        </div>
      </div>

      <!-- Lottery Type field -->
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <label class="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4" for="lotteryType">
            Lottery Type <span class="text-red-500">*</span>
          </label>
          <div class="w-2/3">
            <input
              v-model="formData.lotteryType"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
              id="lotteryType"
              type="text"
              placeholder="Enter lottery type"
              required
            />
            <div v-if="validationErrors.lotteryType" class="text-red-500 text-sm mt-1">
              {{ validationErrors.lotteryType }}
            </div>
          </div>
        </div>
      </div>

      <!-- Phone Number field -->
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <label class="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4" for="phone">
            Phone Number <span class="text-red-500">*</span>
          </label>
          <div class="w-2/3">
            <input
              v-model="formData.phoneNumber"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              required
            />
            <div v-if="validationErrors.phoneNumber" class="text-red-500 text-sm mt-1">
              {{ validationErrors.phoneNumber }}
            </div>
          </div>
        </div>
      </div>

      <!-- Form buttons -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="resetForm"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Reset
        </button>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { addDoc, collection } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '~/firebase/firebase';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  onSubmit: {
    type: Function,
    required: true
  },
  collectionName: {
    type: String,
    required: true
  }
});

const validationErrors = ref({
  name: '',
  username: '',
  password: '',
  lotteryType: '',
  phoneNumber: ''
});

const alertVisible = ref(false);
const alertName = ref('');

const CreateUsers = async () => {
  Object.keys(validationErrors.value).forEach(key => {
    validationErrors.value[key] = '';
  });

  const { name, username, password, lotteryType, phoneNumber } = props.formData;

  let hasErrors = false;

  // Validation logic
  if (!name) {
    validationErrors.value.name = 'Name is required.';
    hasErrors = true;
  }
  if (!username) {
    validationErrors.value.username = 'Username is required.';
    hasErrors = true;
  }
  if (!password) {
    validationErrors.value.password = 'Password is required.';
    hasErrors = true;
  }
  if (!lotteryType) {
    validationErrors.value.lotteryType = 'Lottery type is required.';
    hasErrors = true;
  }
  if (!phoneNumber) {
    validationErrors.value.phoneNumber = 'Phone number is required.';
    hasErrors = true;
  }

  if (hasErrors) {
    return; 
  }

  try {
    const docRef = await addDoc(collection(db, props.collectionName), props.formData);
    alertName.value = name;
    alertVisible.value = true;

    setTimeout(() => {
      alertVisible.value = false; // Hide the alert after 3 seconds
    }, 3000);
    
    console.log('Document written with ID: ', docRef.id);
    
    resetForm();

    // Check if onSubmit is a function before calling
    if (typeof props.onSubmit === 'function') {
      props.onSubmit();
    } else {
      console.error('onSubmit is not a function');
    }

  } catch (e) {
    console.error('Error adding document: ', e);
    alert(`Error adding account: ${e.message || e}`);
  }
};

const resetForm = () => {
  for (const key in props.formData) {
    props.formData[key] = '';
  }
  Object.keys(validationErrors.value).forEach(key => {
    validationErrors.value[key] = '';
  });
};
</script>
