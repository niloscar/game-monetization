import teamPhoto from '../assets/team-photo.png'

interface TeamMember {
    name: string
    role: string
    bio: string
    githubUrl: string | null
    linkedinUrl: string | null
    cvUrl: string | null
}

// (githubUrl/linkedinUrl/cvUrl kan lämnas som null om vi inte
// vill visa en viss länk, knappen döljs då automatiskt).
const TEAM: TeamMember[] = [
    {
        name: 'Julia L',
        role: 'UI/UX-design, frontend, backend',
        bio: 'Har en förkälek för att svänga bilar i sladd på både is och grus, om inte som förare så som CO-driver. Procreate är sällan nedstängt längre stunder, för loggor, sömlösa mönster, posters och allt däremellan måste ju ta sig från fantasi till realitet. Fikar helst med gott humör och sämre ordvitsar.',
        githubUrl: 'https://github.com/13jel',
        linkedinUrl: 'https://www.linkedin.com/in/juliaelindstrom/',
        cvUrl: 'https://cv-julialindstrom.vercel.app/'
    },
    {
        name: 'Oscar N',
        role: 'Backend, backa Julia in crazy ideas',
        bio: 'Gillar att förstå hur saker fungerar och har svårt att låta bli att fundera på hur de skulle kunna göras bättre. Har ofta något eget projekt på gång och testar gärna nya idéer. Fritiden går ofta åt till surfing, löpning på skogsstigar och, på senare tid, segling.',
        githubUrl: 'https://github.com/niloscar',
        linkedinUrl: 'https://linkedin.com/in/TODO',
        cvUrl: 'https://linkedin.com/oscar-nilsson1'
    },
    {
        name: 'Christoffer H',
        role: 'Frontend, stå ut med J och O',
        bio: 'Alltid glad, östgötsk och med ett leende på läpparna. Har ett stort intresse för datorer och utveckling, men även för träning. När han inte sitter framför datorn så kan man hitta honom på gymmet eller framför ett roligt spel.',
        githubUrl: 'https://github.com/Chrisgainz',
        linkedinUrl: 'https://linkedin.com/in/TODO',
        cvUrl: 'https://linkedin.com/in/TODO'
    }
]

const AboutPage = () => {
    return (
        <div className="score-page">
            <div className="card about-hero">
                <img
                    src={teamPhoto}
                    alt="Julia, Oscar och Christoffer"
                    className="team-photo"
                />
            </div>

            <div className="page-title">
                <h1>OM PROJEKTET</h1>
            </div>

            <div className="card">
                <p>
                    Det här är ett skolprojekt från FSU25D-programmet på
                    Medieinstitutet, byggt av tre studenter på programmet
                    Fullstack Developer. Projektet landade i en spelob eroende
                    plattform som möjliggör intäktsgenerering kring befintliga
                    spel. Fokus ligger på användarhantering, köp och
                    åtkomstkontroll, inte på att göra själva spelet. Plattformen
                    är byggd för att spel ska kunna bytas ut med så få ändringar
                    som möjligt, och{' '}
                    <span className="fake-italic">Pizza Arcade</span> är det
                    exempelspel vi byggt för att visa hur det fungerar i
                    praktiken.
                </p>
                <p>
                    På plattformen kan man skapa konto, köpa engångspaket
                    <span className="fake-italic">
                        (Quarter Pass, Combo Pass och High Score Access)
                    </span>{' '}
                    för mer statistik och funktioner, spela för scores och
                    klättra på en topplista. Under huven ligger en
                    React/TypeScript-frontend som pratar med ett eget
                    Express/TypeScript-API, med Postgres{' '}
                    <span className="fake-italic">(Neon)</span> som databas.
                </p>
            </div>

            {/* ================= TEAMET ================= */}
            <div className="page-title">
                <h2>OM TEAMET</h2>
            </div>
            <div className="team-row">
                {TEAM.map((member) => (
                    <div key={member.name} className="card team-card">
                        <h3>{member.name}</h3>
                        <p className="profile-meta">{member.role}</p>
                        <p>{member.bio}</p>
                        <div className="profile-actions">
                            {member.githubUrl && (
                                <a
                                    href={member.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn"
                                >
                                    GitHub
                                </a>
                            )}
                            {member.linkedinUrl && (
                                <a
                                    href={member.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn"
                                >
                                    LinkedIn
                                </a>
                            )}
                            {member.cvUrl && (
                                <a
                                    href={member.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn"
                                >
                                    CV
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AboutPage
