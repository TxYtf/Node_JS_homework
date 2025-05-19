// Задача
// ~~~~~~
// Реалізувати функцію яка зможе порахувати Chill Student середній бал.
// Середній бал це сума всіх оцінок поділена на кількість спеціалізацій.
//
// Приклад
// ~~~~~~~
// { name: 'Andriy',
//   grades: [
//      { name: 'Algebra',       score: 2         },
//      { name: 'Physics',       score: 6         },
//      { name: 'Invalid Grade', score: null      },
//      { name: 'Chemistry',     score: undefined },
//      { name: 'History',       score: 9         }
//   ]
// }
//
// Дасть відповідь: 3.40

const averageGrade = (person) => {
    console.log("Student's name is:",person.name + ", his/her scores are:");
    let average= 0;
    let sum = 0;
    for (let i = 0; i < person.grades.length; i++) {
        console.log("  - grades[" + i + "].name:",person.grades[i].name, "-> score:", person.grades[i].score);
        sum += (person.grades[i].score ?? 0);
        average = sum/(i + 1);
    }
    console.log("Average",person.name+"'s score is:",average);
}

averageGrade({
    name: 'Chill Student',
    grades: [
        {
            name: 'Math',
            score: 1,
        },
        {
            name: 'Science',
            score: 5
        },
        {
            name: 'Invalid Name',
            score: null
        },
        {
            name: 'Invalid Subject',
            score: undefined
        },
        {
            name: 'Biology',
            score: 10
        }
    ]
});
