import { Container } from "@/components/common/Container";
import { Series } from "@/components/home/Series";
import { TypographyH1 } from "@/components/ui/typography/typography-h1";

export default async function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Container id="series" className="space-y-20">
                <TypographyH1 className="text-center">Series</TypographyH1>
                <Series />
            </Container>
        </main>
    );
}
