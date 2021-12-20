export function initializeNavbar(currRole)
{
    let roleObj = []

    let homeRole = ['academic department', 'student', 'lecturer', 'administrative department', 'proctor', 'scoring department']
    let homeObj = {
        role: homeRole,
        name: 'Home',
        dest: `./home.html`
    }
    roleObj.push(homeObj)

    let classRole = ['student', 'lecturer', 'administrative department', ]
    let classObj = {
        role: classRole,
        name: 'Class',
        dest: `./class.html`
    }
    roleObj.push(classObj)
    
    let forumRole = ['student', 'lecturer']
    let forumObj = {
        role: forumRole,
        name: 'Forum',
        dest: `./forum.html`
    }
    roleObj.push(forumObj)
    
    let curriculumRole = ['academic department']
    let curriculumObj = {
        role: curriculumRole,
        name: 'Curriculum',
        dest: `./curriculum.html`
    }
    roleObj.push(curriculumObj)

    let courseRole = ['academic department']
    let courseObj = {
        role: courseRole,
        name: 'Course',
        dest: `./course.html`
    }
    roleObj.push(courseObj)
    
    let attendanceRole = ['student', 'proctor', 'lecturer']
    let attendanceObj = {
        role: attendanceRole,
        name: 'Attendance',
        dest: `./attendance.html`
    }
    roleObj.push(attendanceObj)
    
    let scoreRole = ['lecturer', 'student', 'scoring department']
    let scoreObj = {
        role: scoreRole,
        name: 'Score',
        dest: `./score.html`
    }
    roleObj.push(scoreObj)
    
    let examRole = ['administrative department', 'student', 'lecturer']
    let examObj = {
        role: examRole,
        name: 'Exam',
        dest: `./exam.html`
    }
    roleObj.push(examObj)    
    
    roleObj.map((obj) => {
        if(obj.role.indexOf(currRole) >= 0)
        {
            let navTemplate = document.getElementById('nav-item-template')
            let navBody = document.getElementById('navbar-list')
            let navClone = navTemplate.content.cloneNode(true)
            let navA = navClone.querySelector('a')
            navA.href = obj.dest
            navA.textContent = obj.name
            navBody.appendChild(navClone)
        }
    })
}