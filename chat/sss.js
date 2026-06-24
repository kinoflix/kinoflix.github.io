const isNormalBan = isTargetBanned && !user.banExpires;
        const isTempBan = isTargetBanned && user.banExpires;

        
        // BİRİNCİ HİSSƏ: SSENARİLƏRƏ GÖRƏ BAN BUTONLARI
        // Ssenari 1: Əgər network ban aktivdirsə:
        if (isNetworkBanned) {
        if (myLevel === 4) {
            dropdownItems += `<button class="dropdown-item network-ban-action network-banned" data-uid="${user.uid}">
                <i class="fa-solid fa-wifi"></i>
                <span class="label">IP və Cihazının banını aç</span>
            </button>`;
        }
        }
        // Ssenari 2: Əgər Temp ban aktivdirsə:
        else if (isTempBan && canTempBan) {
            dropdownItems += `<button class="dropdown-item temp-ban-action temp-ban-active" data-uid="${user.uid}" data-name="${escapeHTML(username)}">
                <i class="fa-solid fa-clock"></i>
                <span class="label">Müddətli banını aç</span>
            </button>`;
            // Temp ban olan şəxsə admin "Ban et" edə bilər (normal ban tətbiq etmək üçün)
            if (canBan) {
                dropdownItems += `<button class="dropdown-item ban-action" data-uid="${user.uid}" data-banned="false">
                    <i class="fa-solid fa-user-slash"></i>
                    <span class="label">Müddətsiz ban et</span>
                </button>`;
            }
            // Super admin "IP/Cihaz banı" tətbiq edə bilər
            if (myLevel === 4) {
                dropdownItems += `<button class="dropdown-item network-ban-action" data-uid="${user.uid}">
                    <i class="fa-solid fa-wifi"></i>
                    <span class="label">IP cə Cihazını ban et</span>
                </button>`;
            }
        }
        // Ssenari 3: Əgər Normal ban aktivdirsə:
        else if (isNormalBan && canBan) {
            dropdownItems += `<button class="dropdown-item ban-action ban-active" data-uid="${user.uid}" data-banned="true">
                <i class="fa-solid fa-user-check"></i>
                <span class="label">Müddətsiz banını aç</span>
            </button>`;
            // Super admin "IP/Cihaz banı" tətbiq edə bilər
            if (myLevel === 4) {
                dropdownItems += `<button class="dropdown-item network-ban-action" data-uid="${user.uid}">
                    <i class="fa-solid fa-wifi"></i>
                    <span class="label">IP və Cihazını ban et</span>
                </button>`;
            }
        }
        // Ssenari 4: Heç bir ban yoxdursa:
        else if (!isTargetBanned && !isNetworkBanned) {
            if (canTempBan) {
                dropdownItems += `<button class="dropdown-item temp-ban-action" data-uid="${user.uid}" data-name="${escapeHTML(username)}">
                    <i class="fa-solid fa-clock"></i>
                    <span class="label">Müddətli ban et</span>
                </button>`;
            }
         
            if (canBan) {
                dropdownItems += `<button class="dropdown-item ban-action" data-uid="${user.uid}" data-banned="false">
                    <i class="fa-solid fa-user-slash"></i>
                    <span class="label">Müddətsiz ban et</span>
                </button>`;
            }
            
            if (myLevel === 4) {
                dropdownItems += `<button class="dropdown-item network-ban-action" data-uid="${user.uid}">
                    <i class="fa-solid fa-wifi"></i>
                    <span class="label">IP və Cihazını ban et</span>
                </button>`;
            }
        }
        // İKİNCİ HİSSƏ: MÜSTƏQİL-ŞƏRTSİZ BUTONLAR
        // 1. Hesabı silmə – yalnız super admin üçün

       if (canDelete) {
            dropdownItems += `<button class="dropdown-item delete-action danger" data-uid="${user.uid}">
                <i class="fa-solid fa-user-minus"></i>
                <span class="label">Hesabı sil</span>
            </button>`;
        }

        // 2. Rol dəyişmə – bütün hallarda (əgər icazə varsa)
       if (canRole) {
            dropdownItems += `<button class="dropdown-item role-action" data-uid="${user.uid}" data-role="${user.role || 'user'}">
                <i class="fa-solid fa-user-gear"></i>
                <span class="label">Rolu dəyiş</span>
            </button>`;
        }

        // 3. İgnor – hər kəs üçün
        if (canIgnore) {
            const ignoreLabel = isIgnored ? 'İgnoru qaldır' : 'İgnor et';
            const ignoreIcon = isIgnored ? 'fa-eye-slash' : 'fa-eye';
            dropdownItems += `<button class="dropdown-item ignore-action" data-uid="${user.uid}" data-name="${escapeHTML(username)}">
                <i class="fa-solid ${ignoreIcon}"></i>
                <span class="label">${ignoreLabel}</span>
            </button>`;
        }

        // 4. Whois – yalnız super admin üçün
        if (canWhois) {
            dropdownItems += `<button class="dropdown-item whois-action" data-uid="${user.uid}" data-name="${escapeHTML(username)}">
                <i class="fa-solid fa-circle-info"></i>
                <span class="label">Whois</span>
            </button>`;
        }
