<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\Media;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\Validator\ValidatorInterface;

#[AsController]
class ProjectAddController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $user = $this->getUser();

        $json = $request->getContent();

        $decoded = json_decode($json, true);
        $mediaIRIs = $decoded['media'] ?? [];

        // Retirer les media avant désérialisation pour éviter l'erreur "unknown attribute"
        unset($decoded['media']);
        $cleanJson = json_encode($decoded);

        $context = [
            'groups' => ['write'],
            AbstractNormalizer::ALLOW_EXTRA_ATTRIBUTES => false,
        ];

        try {
            /** @var Project $project */
            $project = $this->serializer->deserialize($cleanJson, Project::class, 'json', $context);
        } catch (ExceptionInterface $e) {
            return new JsonResponse(['error' => 'Erreur de désérialisation', 'detail' => $e->getMessage()], 400);
        }

        $this->validator->validate($project);

        foreach ($mediaIRIs as $iri) {
            $id = basename($iri);
            $media = $this->em->getRepository(Media::class)->find($id);
            if (!$media) {
                return new JsonResponse(['error' => "Media non trouvé: $iri"], 400);
            }
            $project->addMedia($media);
        }

        $this->em->persist($project);
        $this->em->flush();

        return new JsonResponse(['message' => 'Projet créé avec succès'], 201);
    }
}
