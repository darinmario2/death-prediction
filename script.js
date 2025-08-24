document.getElementById('predict-btn').addEventListener('click', () => {

    const nameValue = document.getElementById('name').value.trim();
    const ageValue = document.getElementById('age').value.trim();
    const foodValue = document.getElementById('food').value.trim();

    if (nameValue === '' || ageValue === '' || foodValue === '') {
        alert('Please enter all fields before predicting!');
        return; 
    }
    const age = parseInt(ageValue);

    if (isNaN(age) || age <= 0) {
        document.getElementById('result').textContent = 'Please enter a valid age.';
        return;
    }
    const remainingYears = predictRemainingYears(age, foodValue.toLowerCase());
    
    if (remainingYears <= 0) {
        document.getElementById('result').textContent = 'Your time is up!';
    } else {
        document.getElementById('result').textContent = `You have approximately ${remainingYears} years left.`;
    }

    updateManPosition(remainingYears);
});

function predictRemainingYears(age, food) {
    let baseLifespan = 80;
    const goodFoods = ['salad', 'fish', 'vegetables', 'fruits', 'oats', 'apple', 'sprouts','bread'];
    const badFoods = ['pizza', 'burger', 'soda','sandwich', 'chips', 'candy', 'ice cream','biriyani','fried rice','chicken'];

    if (goodFoods.includes(food)) {
        baseLifespan += 5;
    } else if (badFoods.includes(food)) {
        baseLifespan -= 5;
    }

    const remaining = baseLifespan - age;
    return Math.max(0, remaining);
}

function updateManPosition(remainingYears) {
    const man = document.getElementById('man-with-shovel');
    const pit = document.getElementById('death-pit');
    const container = document.querySelector('.left-side');

    if (remainingYears <= 0) {
        man.classList.add('is-dead');
    } else {
        man.classList.remove('is-dead');

        const containerWidth = container.offsetWidth;
        const manWidth = man.offsetWidth;
        
        // Final stopping point is closer to the pit's edge
        const endPosition = pit.offsetLeft - manWidth + 40; 
        const startPosition = 0;
        const movementRange = endPosition - startPosition;

        // How much life is left, as a percentage
        const percentageLifeLeft = remainingYears / 80;

        // By raising the "life left" to a power, we keep him near the start.
        // If 50% of life is left (0.5), (0.5)^0.2 = 87% of the journey is *still left to go*.
        // This makes him stay near the start for a long time.
        const power = 0.2; // A power < 1 on "life left" creates the slow start.
        const journeyLeftToGo = Math.pow(percentageLifeLeft, power);

        // The journey completed is simply 1 minus the journey left to go.
        const journeyCompleted = 1 - journeyLeftToGo;

        let newPosition = startPosition + (movementRange * journeyCompleted);        
        man.style.left = `${newPosition}px`;
    }
}