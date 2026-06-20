// Rol düyməsi: yalnız super_admin, hər kəsə tətbiq edə bilər
        const roleButtonHtml = (myLevel === 4)
            ? `<button class="role-toggle-btn" onclick="event.stopPropagation(); changeUserRole('${user.uid}', '${user.role || 'user'}')" title="Rolu idarə et (Hazırda: ${user.role || 'user'})"><i class="fa-solid fa-user-gear"></i></button>`
            : '';
