"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createUserByAdmin,
  getUsers,
  updateUserStatus,
} from "../../../../services/login/loginService";
import { validateEmail, validateRequired } from "../../../../utils/globalValidator";
import { ADD_USER_INITIAL_FORM } from "../constants";

const REQUIRED_FIELDS_MESSAGE =
  "Complete username, email, and temporary password before adding user.";

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(ADD_USER_INITIAL_FORM);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      `${user.username} ${user.email} ${user.role} ${user.status}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query, users]);

  const refreshUsers = async () => {
    try {
      setUsers(await getUsers());
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    getUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setAlertMessage("");
  };

  const addUser = (event) => {
    event.preventDefault();

    if (
      validateRequired(form.username, "Username") ||
      validateEmail(form.email) ||
      validateRequired(form.password, "Temporary password")
    ) {
      setAlertMessage(REQUIRED_FIELDS_MESSAGE);
      return;
    }

    const result = createUserByAdmin(form);

    setAlertMessage(result.message);

    if (result.ok) {
      setForm(ADD_USER_INITIAL_FORM);
      setIsAddUserOpen(false);
      refreshUsers();
    }
  };

  const toggleUserStatus = (user) => {
    const nextStatus = user.status === "Inactive" ? "Active" : "Inactive";

    updateUserStatus(user.email, nextStatus);
    refreshUsers();
  };

  return {
    addUser,
    alertMessage,
    filteredUsers,
    form,
    isAddUserOpen,
    isPasswordVisible,
    query,
    setIsAddUserOpen,
    setIsPasswordVisible,
    setQuery,
    toggleUserStatus,
    updateField,
  };
}
