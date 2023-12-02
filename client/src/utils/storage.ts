import localforage from 'localforage';

const enum Key {
  USERNAME = 'username'
}

export const setUsername = async (v?: string) => {
  try {
    await localforage.setItem(Key.USERNAME, v);
    return true;
  } catch (error: unknown) {
    console.log(error);
  }
  return false;
};

export const getUsername = async () => {
  return await localforage.getItem<string>(Key.USERNAME);
};
