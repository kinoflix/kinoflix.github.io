async function changeUserRole(userId, currentRole) {
    const myLevel = getRoleLevel(currentUserData.role);
    if (myLevel !== 4) {
        showToast("Bu əməliyyat üçün Super Admin səlahiyyətiniz olmalıdır!", "error");
        return;
    }
    const newRole = prompt(`İstifadəçinin yeni rolunu daxil edin:\n(super_admin, admin, moderator, user)\n\nHazırki rol: ${currentRole}`, currentRole);
    if (!newRole) return;
    const validRoles = ["super_admin", "admin", "moderator", "user"];
    const targetRoleClean = newRole.trim().toLowerCase();
    if (!validRoles.includes(targetRoleClean)) {
        showToast("Yanlış rol! Yalnız: super_admin, admin, moderator, user qəbul edilir.", "warning");
        return;
    }
    try {
        await updateDoc(doc(db, 'users', userId), { role: targetRoleClean });
        showToast("İstifadəçinin rolu uğurla yeniləndi!", "success");
    } catch (error) {
        console.error("Rol dəyişərkən xəta:", error);
        showToast("Rol dəyişdirilə bilmədi: " + error.message, "error");
    }
}
