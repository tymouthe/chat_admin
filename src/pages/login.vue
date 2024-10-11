<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Enter your username"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </div>
        <p v-if="error" class="text-red-500 text-xs italic mt-4">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '~/firebase/firebase';

const username = ref('');
const password = ref('');
const error = ref(null);
const router = useRouter();

const roleCollections = ['superadmin','supersenior', 'senior', 'master', 'agent'];

const login = async () => {
  try {
    let userData = null;
    let userRole = '';
    for (let role of roleCollections) {
      const roleQuery = query(collection(db, role), where('username', '==', username.value));
      const querySnapshot = await getDocs(roleQuery);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          userData = doc.data();
        });
        userRole = role;
        break;
      }
    }

    if (userData) {
      if (userData.password === password.value) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', userData.username);
        localStorage.setItem('role', userRole);
        router.push('/');
      } else {
        error.value = 'Invalid username or password';
      }
    } else {
      error.value = 'User not found';
    }
  } catch (err) {
    console.error('Error logging in:', err);
    error.value = 'Error logging in';
  }
};
</script>