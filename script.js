document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    console.log('Current date:', currentDate);

    fetch('airshows.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#airshow-table tbody');
            const todayEvents = [];
            const upcomingEvents = [];

            data.forEach(airshow => {
                const airshowDate = parseAirshowDate(airshow.date);
                console.log(`Processing ${airshow.event}: date=${airshowDate}`);

                if (isSameDate(currentDate, airshowDate)) {
                    todayEvents.push(airshow);
                } else if (airshowDate > currentDate) {
                    upcomingEvents.push(airshow);
                }
            });

            // Sort upcoming events by date
            upcomingEvents.sort((a, b) => parseAirshowDate(a.date) - parseAirshowDate(b.date));

            // Render today's events at the top
            todayEvents.forEach(airshow => renderAirshow(airshow, tableBody, true));

            // Render upcoming events
            upcomingEvents.forEach(airshow => renderAirshow(airshow, tableBody, false));
        })
        .catch(error => console.error('Error loading the airshow data:', error));
});

function parseAirshowDate(dateString) {
    const [day, month] = dateString.split(' ');
    const year = new Date().getFullYear();
    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
    return new Date(year, monthIndex, parseInt(day, 10));
}

function isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function renderAirshow(airshow, tableBody, isToday) {
    const row = document.createElement('tr');
    if (isToday) row.classList.add('today-event');
    
    const countryCell = document.createElement('td');
    const flagImg = document.createElement('img');
    flagImg.src = `https://flagcdn.com/w40/${airshow.country.toLowerCase()}.png`;
    flagImg.alt = `${airshow.country} flag`;
    flagImg.className = 'flag';
    countryCell.appendChild(flagImg);
    countryCell.appendChild(document.createTextNode(airshow.country));
    
    const dateCell = document.createElement('td');
    dateCell.textContent = airshow.date;
    
    const nameCell = document.createElement('td');
    if (isToday) {
        const liveIcon = document.createElement('i');
        liveIcon.className = 'fa-solid fa-plane live-icon';
        nameCell.appendChild(liveIcon);
        nameCell.appendChild(document.createTextNode(' ')); // Add space after icon
    }
    nameCell.appendChild(document.createTextNode(airshow.event));
    
    const locationCell = document.createElement('td');
    locationCell.textContent = airshow.location;
    
    row.appendChild(countryCell);
    row.appendChild(dateCell);
    row.appendChild(nameCell);
    row.appendChild(locationCell);
    
    tableBody.appendChild(row);
}