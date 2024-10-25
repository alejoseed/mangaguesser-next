// game/Test.tsx
interface MangaResponse {
    mangas: string[];
    CurrentStoredMangaId: string,
}

interface ImageResponse {
    imageUrl: string;
}


export default function Test({ 
    mangaInfo,
    mangaUrl,
}: { 
    mangaInfo: MangaResponse,
    mangaUrl: ImageResponse 
}) {
    const buttonStyles = [
        { backgroundColor: "#89CFF0" }, // Light Blue
        { backgroundColor: "#E3735E" }, // Salmon
        { backgroundColor: "#36454F" }, // Charcoal
        { backgroundColor: "#009e60" }  // Green
    ];

    const getButtonStyle = (index: number, title: string) => ({
        ...buttonStyles[index],
        fontSize: title.length > 41 ? '12px' : 'inherit'
    });
    
    return (
        <div>
            <img className="md:h-[40vw] md:w-[40vw] lg:h-[30vw] lg:w-[30vw] sm:h-[40vw] sm:w-[40vw] h-[90vw] w-[90vw] object-contain " src={""}  alt="No Manga Found" />
            
            <div className="grid gap-x-4 grid-cols-2 items-center pt-3">
                <div className="grid grid-cols-1 gap-y-2">
                    <button className="buttonManga w-full" style={getButtonStyle(0, mangaInfo.mangas[0] || "")}>
                    {mangaInfo.mangas[0]}</button>
                    <button className="buttonManga w-full" style={getButtonStyle(1, mangaInfo.mangas[1] || "")}>{mangaInfo.mangas[1]}</button>
                </div>
                <div className="grid grid-cols-1 gap-y-2">
                <button className="buttonManga w-full" style={getButtonStyle(2, mangaInfo.mangas[2] || "")}>{mangaInfo.mangas[2]}</button>
                <button className="buttonManga w-full" style={getButtonStyle(3, mangaInfo.mangas[3] || "")}>{mangaInfo.mangas[3]}</button>
                </div>
            </div>

        </div>

    );
}

export async function getServerSideProps() {
    try {
        const mangaResponse = await fetch('http://localhost:3000/api/getMangaNames');
        const urlResponse = await fetch('http://localhost:3000/api/getMangaImage');
        console.log("MangaResponse", mangaResponse);
        const mangaInfo = await mangaResponse.json();
        const mangaUrl = await urlResponse.json();

        return {
            props: {
                mangaInfo,
                mangaUrl: {imageUrl: ""}
            },
        }

    } catch (error) {
        console.error('Error fetching manga data:', error);
        return { 
            props: {
                mangaInfo: {
                    mangas: ['Error loading manga 1', 'Error loading manga 2', 'Error loading manga 3', 'Error loading manga 4'],
                    CurrentStoredMangaId: ''
                }
            }
        };
    }
}