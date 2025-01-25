export function formatDateTime(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let datePart: string;

    if (date.toDateString() === today.toDateString()) {
        datePart = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        datePart = 'Tomorrow';
    } else {
        datePart = date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    const timePart = date.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return `${datePart} - ${timePart}`;
}


