"use client";

import Container from "../../../../components/Container/Container";
import Button from "../../../../components/Button/Button";
import { globalStyles } from "../../../../styles/global.style";
import { ROLE_OPTIONS } from "../constants";
import useAdminUsers from "../hooks/useAdminUsers";
import styles from "../users.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function AdminUsersContent() {
  const {
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
  } = useAdminUsers();

  return (
    <>
      <Container title="User List">
        <div className={styles.toolbar}>
          <input
            className={globalStyles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users"
            aria-label="Search users"
          />
          <Button type="button" onClick={() => setIsAddUserOpen(true)}>
            <span aria-hidden="true" className={styles.addUserIcon}>
              +
            </span>
            <span>Add User</span>
          </Button>
        </div>

        <div className={cn(globalStyles.tableWrap, "mt-4")}>
          <div className={globalStyles.tableScroll}>
            <table className={globalStyles.table}>
              <thead className={globalStyles.tableHead}>
                <tr>
                  <th className={globalStyles.tableHeadCell}>Name</th>
                  <th className={globalStyles.tableHeadCell}>Email</th>
                  <th className={globalStyles.tableHeadCell}>Role</th>
                  <th className={globalStyles.tableHeadCell}>Status</th>
                  <th className={globalStyles.tableHeadCell}>Password</th>
                  <th className={globalStyles.tableHeadCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.email}
                    className={cn(
                      globalStyles.tableRow,
                      user.status === "Inactive" && styles.inactiveRow
                    )}
                  >
                    <td className={globalStyles.tableCell}>{user.username}</td>
                    <td className={globalStyles.tableCell}>{user.email}</td>
                    <td className={globalStyles.tableCell}>{user.role}</td>
                    <td className={globalStyles.tableCell}>{user.status}</td>
                    <td className={globalStyles.tableCell}>
                      {user.mustChangePassword ? "Change required" : "Set"}
                    </td>
                    <td className={globalStyles.tableCell}>
                      {user.isSystemUser ? (
                        "Locked"
                      ) : (
                        <button
                          type="button"
                          className={
                            user.status === "Inactive"
                              ? styles.actionButton
                              : styles.dangerButton
                          }
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.status === "Inactive"
                            ? "Reactivate"
                            : "Deactivate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>

      {isAddUserOpen && (
        <div className={styles.modalOverlay} role="presentation">
          <section
            className={styles.modalPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
          >
            <div className={styles.modalHeader}>
              <h2 id="add-user-title" className={styles.modalTitle}>
                Add User
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close add user modal"
                onClick={() => setIsAddUserOpen(false)}
              >
                x
              </button>
            </div>

            <form className={styles.addUserForm} onSubmit={addUser} noValidate>
              <input
                className={globalStyles.input}
                value={form.username}
                onChange={(event) => updateField("username", event.target.value)}
                placeholder="Username"
                aria-label="Username"
              />
              <input
                className={globalStyles.input}
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Email"
                aria-label="Email"
                type="email"
              />
              <select
                className={styles.select}
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                aria-label="Role"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.key} value={role.key}>
                    {role.label}
                  </option>
                ))}
              </select>
              <span className={styles.passwordInputWrap}>
                <input
                  className={styles.passwordInput}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Temporary password"
                  aria-label="Temporary password"
                  type={isPasswordVisible ? "text" : "password"}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setIsPasswordVisible((current) => !current)}
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </span>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </button>
                <Button type="submit">Create User</Button>
              </div>
            </form>

            {alertMessage && (
              <div className={styles.alert} role="alert">
                {alertMessage}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
